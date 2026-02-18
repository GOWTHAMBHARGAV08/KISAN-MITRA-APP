export const LANGUAGES = [
    { value: 'english', code: 'en', locale: 'en-IN', label: 'English', prompt: 'Respond in English' },
    { value: 'hindi', code: 'hi', locale: 'hi-IN', label: 'हिन्दी (Hindi)', prompt: 'Respond in Hindi language' },
    { value: 'tamil', code: 'ta', locale: 'ta-IN', label: 'தமிழ் (Tamil)', prompt: 'Respond in Tamil language' },
    { value: 'telugu', code: 'te', locale: 'te-IN', label: 'తెలుగు (Telugu)', prompt: 'Respond in Telugu language' },
    { value: 'kannada', code: 'kn', locale: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', prompt: 'Respond in Kannada language' },
    { value: 'bengali', code: 'bn', locale: 'bn-IN', label: 'বাংলা (Bengali)', prompt: 'Respond in Bengali language' },
    { value: 'marathi', code: 'mr', locale: 'mr-IN', label: 'मराठी (Marathi)', prompt: 'Respond in Marathi language' },
    { value: 'gujarati', code: 'gu', locale: 'gu-IN', label: 'ગુજરાતી (Gujarati)', prompt: 'Respond in Gujarati language' },
    { value: 'malayalam', code: 'ml', locale: 'ml-IN', label: 'മലയാളം (Malayalam)', prompt: 'Respond in Malayalam language' },
    { value: 'punjabi', code: 'pa', locale: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', prompt: 'Respond in Punjabi language' },
    { value: 'odia', code: 'or', locale: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', prompt: 'Respond in Odia language' },
] as const;

export type LanguageValue = typeof LANGUAGES[number]['value'];

export const getLanguageByValue = (value: string) =>
    LANGUAGES.find(l => l.value === value) || LANGUAGES[0];
