import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Camera, Upload, X, Globe, Mic, MicOff, Volume2, Bot, StopCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfileLanguage } from '@/hooks/useProfileLanguage';
import { LANGUAGES } from '@/constants/languages';

/* Speech Recognition Interfaces */
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => ISpeechRecognition;
    SpeechRecognition: new () => ISpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  image?: string;
  language?: string;
}

// Map languages for easy access, now including locale using the updated type definition
const languages = LANGUAGES.reduce((acc, lang) => {
  acc[lang.value] = {
    code: lang.code,
    // @ts-ignore - locale was added to the constant
    locale: lang.locale || lang.code,
    name: lang.label,
    prompt: lang.prompt
  };
  return acc;
}, {} as Record<string, { code: string; locale: string; name: string; prompt: string }>);

export const MultilangChatbot = () => {
  const { profileLanguage } = useProfileLanguage();
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'bot',
      message: 'Namaste! I am your Kisan Assistant. Ask me anything about farming, weather, or crops in your language.',
      language: 'english'
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const effectiveLanguage = selectedLanguage ?? profileLanguage;

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const callFarmingChat = async (message: string, imageBase64?: string, language: string = 'english'): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('farming-chat', {
        body: { message, imageBase64, language },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.response || 'Sorry, I currently cannot answer that.';
    } catch (error) {
      console.error('Chat error:', error);
      return 'Connection error. Please check your internet.';
    }
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    toast({ title: "Photo Added", description: "You can now ask a question about this photo." });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakResponse = (text: string, language: string) => {
    if (!('speechSynthesis' in window)) return;

    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = languages[language as keyof typeof languages];
    // Use the specific locale (e.g., 'te-IN') or fallback to code (e.g., 'te')
    const targetLocale = langConfig?.locale || langConfig?.code || 'en-US';

    utterance.lang = targetLocale;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Try to find a voice that matches the locale exactly
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === targetLocale) ||
      voices.find(voice => voice.lang.startsWith(targetLocale.split('-')[0]));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ title: "Not Supported", description: "Voice input not supported in this browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Initialize only when needed to ensure fresh state/language
    const SpeechRecognitionClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;

    const langConfig = languages[effectiveLanguage as keyof typeof languages];
    recognition.lang = langConfig?.locale || langConfig?.code || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: "Listening...", description: "Speak now." });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setChatMessage(transcript);
        // Automatically send after a short delay if transcript is received
        // setTimeout(() => handleSendMessage(undefined, transcript), 500); 
        // User requirements say "Text appears in input field" -> "Text is sent to chatbot"
        // Let's populate it and let user click send or auto-send. 
        // Logic constraint: "Text appears in input field" implies visualization first.
      }
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast({ title: "Error", description: "Could not hear you. Please try again.", variant: "destructive" });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideMessage?: string) => {
    if (e) e.preventDefault();

    // Stop speaking if user interrupts
    stopSpeaking();

    const messageToSend = overrideMessage || chatMessage;
    if ((!messageToSend.trim() && !selectedImage) || isLoading) return;

    const userMessage = messageToSend.trim() || "Analyze this image";
    const imageToSend = selectedImage;

    setChatMessage('');
    setSelectedImage(null);
    setIsLoading(true);

    setChatHistory(prev => [...prev, {
      type: 'user',
      message: userMessage,
      image: imageToSend,
      language: effectiveLanguage
    }]);

    try {
      let aiResponse: string;
      if (imageToSend) {
        const response = await fetch(imageToSend);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        const imageBase64 = await convertImageToBase64(file);
        aiResponse = await callFarmingChat(userMessage, imageBase64, effectiveLanguage);
      } else {
        aiResponse = await callFarmingChat(userMessage, undefined, effectiveLanguage);
      }

      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: aiResponse,
        language: effectiveLanguage
      }]);

      // Automatically speak the response
      // Slight delay to ensure state and UI are ready, and it feels natural
      setTimeout(() => speakResponse(aiResponse, effectiveLanguage), 100);

      if (imageToSend) URL.revokeObjectURL(imageToSend);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: 'Sorry, something went wrong.',
        language: effectiveLanguage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] card-farmer p-0 overflow-hidden bg-[#F0FDF4] relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#2FAE63]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-green-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#2FAE63] to-green-400 rounded-full flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground leading-tight">Kisan Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">Online • {languages[effectiveLanguage]?.name || 'English'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              className="h-9 px-3 rounded-full border-green-200 text-green-700 bg-green-50 animate-pulse"
            >
              <Volume2 className="w-4 h-4 mr-1.5" /> Stop
            </Button>
          )}

          <Select value={effectiveLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[110px] h-9 rounded-full border-green-200 bg-green-50 text-green-700 font-bold text-xs shadow-sm hover:bg-green-100 transition-colors">
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([key, lang]) => (
                <SelectItem key={key} value={key}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" id="chat-container">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-float">
              <MessageCircle className="w-12 h-12 text-[#2FAE63]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Namaste! 🙏</h3>
            <p className="max-w-xs mx-auto text-muted-foreground">
              I am your personal agriculture expert. Ask me anything about crops, weather, or farming tips!
            </p>
          </div>
        )}

        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} group animate-fade-in`}
          >
            <div
              className={`
                max-w-[85%] p-4 rounded-2xl shadow-sm relative text-base leading-relaxed
                ${chat.type === 'user'
                  ? 'bg-[#2FAE63] text-white rounded-tr-none'
                  : 'bg-white text-foreground border border-gray-100 rounded-tl-none'
                }
              `}
            >
              {chat.image && (
                <img
                  src={chat.image}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded-xl mb-3 border border-white/20"
                />
              )}
              <p className="whitespace-pre-wrap">{chat.message}</p>
              {chat.type === 'bot' && (
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speakResponse(chat.message, chat.language || 'english')}
                  className="absolute -right-8 bottom-0 p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Read aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatContainerRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 z-20">

        {/* Helper Chips - Only show if few messages */}
        {chatHistory.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
            {["Best crop for this season?", "How to treat leaf curl?", "Tomato fertilizer prices"].map((chip, i) => (
              <button
                key={i}
                onClick={() => { setChatMessage(chip); }}
                className="whitespace-nowrap px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          {selectedImage && (
            <div className="relative inline-block mb-2">
              <img src={selectedImage} className="h-16 rounded-lg border-2 border-green-200" alt="pre" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="h-10 w-10 rounded-xl border-gray-200 text-gray-500 hover:text-[#2FAE63] hover:bg-green-50 hover:border-green-200 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 rounded-xl border-gray-200 text-gray-500 hover:text-[#2FAE63] hover:bg-green-50 hover:border-green-200 transition-colors"
            >
              <Upload className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-[#2FAE63] focus-within:ring-4 focus-within:ring-green-50 transition-all flex items-center px-4 py-2 min-h-[3rem]">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={effectiveLanguage === 'english' ? "Ask anything..." : "ఏదైనా అడగండి..."}
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-24 py-2 text-base placeholder:text-gray-400"
              rows={1}
              style={{ minHeight: '24px' }}
            />
          </div>

          {chatMessage.trim() || selectedImage ? (
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="h-12 w-12 rounded-2xl bg-[#2FAE63] hover:bg-[#1F8A4C] text-white shadow-lg shadow-green-200 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleVoiceInput}
              type="button"
              className={`h-12 w-12 rounded-2xl flex-shrink-0 transition-all duration-300 shadow-lg ${isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200 animate-pulse scale-105'
                : 'bg-[#2FAE63] hover:bg-[#1F8A4C] shadow-green-200'
                }`}
            >
              {isListening ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};