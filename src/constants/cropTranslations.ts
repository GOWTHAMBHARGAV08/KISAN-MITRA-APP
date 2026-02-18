
export const CROP_TRANSLATIONS: Record<string, Record<string, string>> = {
    RICE: {
        english: "Rice (Paddy)",
        hindi: "धान (चावल)",
        tamil: "நெல் (அரிசி)",
        telugu: " vari (వరి)",
        kannada: "ಭತ್ತ (ಅಕ್ಕಿ)",
        bengali: "ধান",
        marathi: "भाತ್",
        gujarati: "ડાંગર",
        malayalam: "നെല്ല്",
        punjabi: "ਝੋਨਾ",
        odia: "ଧାନ"
    },
    WHEAT: {
        english: "Wheat",
        hindi: "गेहूं",
        tamil: "கோதுமை",
        telugu: "గోధుమ",
        kannada: "ಗೋಧಿ",
        bengali: "গম",
        marathi: "गहू",
        gujarati: "ઘઉં",
        malayalam: "ഗോതമ്പ്",
        punjabi: "ਕਣਕ",
        odia: "ଗହମ"
    },
    COTTON: {
        english: "Cotton",
        hindi: "कपास",
        tamil: "பருத்தி",
        telugu: "పత్తి",
        kannada: "ಹತ್ತಿ",
        bengali: "তুলা",
        marathi: "कापूस",
        gujarati: "કપાસ",
        malayalam: "പരുത്തി",
        punjabi: "ਕਪਾਹ",
        odia: "କପା"
    },
    TOMATO: {
        english: "Tomato",
        hindi: "टमाटर",
        tamil: "தக்காளி",
        telugu: "టమాటా",
        kannada: "ಟೊಮೆಟೊ",
        bengali: "টমেটো",
        marathi: "टोमॅटो",
        gujarati: "ટામેટા",
        malayalam: "തക്കാളി",
        punjabi: "ਟਮਾਟਰ",
        odia: "ଟମାଟୋ"
    },
    MAIZE: {
        english: "Maize (Corn)",
        hindi: "मक्का",
        tamil: "சோளம்",
        telugu: "మొక్కజొన్న",
        kannada: "ಮಕ್ಕೆ ಜೋಳ",
        bengali: "ভুট্টা",
        marathi: "मका",
        gujarati: "મકાઈ",
        malayalam: "ചോളം",
        punjabi: "ਮੱਕੀ",
        odia: "ମକା"
    },
    CHILLI: {
        english: "Chilli",
        hindi: "मिर्च",
        tamil: "மிளகாய்",
        telugu: "మిరప",
        kannada: "ಮೆಣಸಿನಕಾಯಿ",
        bengali: "লঙ্কা",
        marathi: "मिरची",
        gujarati: "મરચું",
        malayalam: "മുളക്",
        punjabi: "ਮਿਰਚ",
        odia: "ଲଙ୍କା"
    },
    UNKNOWN: {
        english: "Unknown Plant",
        hindi: "अज्ञात पौधा",
        tamil: "தெரியாத தாவரம்",
        telugu: "తెలియని మొక్క",
        kannada: "ಅಪರಿಚಿತ ಸಸ್ಯ",
        bengali: "অজানা উদ্ভিদ",
        marathi: "अज्ञात वनस्पती",
        gujarati: "અજાણ્યો છોડ",
        malayalam: "അജ്ഞാത സസ്യം",
        punjabi: "ਅਣਜਾਣ ਪੌਦਾ",
        odia: "ଅଜ୍ଞାତ ଉଦ୍ଭିଦ"
    }
};

export const STATUS_TRANSLATIONS: Record<string, Record<string, string>> = {
    HEALTHY: {
        english: "Healthy",
        hindi: "स्वस्थ",
        tamil: "ஆரோக்கியமான",
        telugu: "ఆరోగ్యకరమైన",
        kannada: "ಆರೋಗ್ಯಕರ",
        bengali: "সুস্থ",
        marathi: "निरोगी",
        gujarati: "તંદુરસ્ત",
        malayalam: "ആരോഗ്യമുള്ള",
        punjabi: "ਸਿਹਤਮੰਦ",
        odia: "ସୁସ୍ଥ"
    },
    DISEASED: {
        english: "Disease Detected",
        hindi: "रोग का पता चला",
        tamil: "நோய் கண்டறியப்பட்டது",
        telugu: "వ్యాధి గుర్తించబడింది",
        kannada: "ರೋಗ ಪತ್ತೆಯಾಗಿದೆ",
        bengali: "রোগ সনাক্ত হয়েছে",
        marathi: "रोग आढळला",
        gujarati: "રોગ જણાયો",
        malayalam: "രോഗം കണ്ടെത്തി",
        punjabi: "ਬਿਮਾਰੀ ਦਾ ਪਤਾ ਲੱਗਾ",
        odia: "ରୋଗ ଚିହ୍ନଟ ହେଲା"
    },
    PEST: {
        english: "Pest Infestation",
        hindi: "कीट का प्रकोप",
        tamil: "பூச்சி தாக்குதல்",
        telugu: "చీడపీడలు",
        kannada: "ಕೀಟ ಬಾಧೆ",
        bengali: "পোকামাকড়ের উপদ্রব",
        marathi: "कीड लागण",
        gujarati: "જીવાત ઉપદ્રવ",
        malayalam: "കീടബാധ",
        punjabi: "ਕੀੜੇ ਦਾ ਹਮਲਾ",
        odia: "ପୋକ ଆକ୍ରମଣ"
    },
    NUTRIENT_DEFICIENCY: {
        english: "Nutrient Deficiency",
        hindi: "पोषक तत्वों की कमी",
        tamil: "ஊட்டச்சத்து குறைபாடு",
        telugu: "పోషకాల లోపం",
        kannada: "ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ",
        bengali: "পুষ্টির অভাব",
        marathi: "पोषक तत्वांची कमतरता",
        gujarati: "પોષક તત્વોની ઉણપ",
        malayalam: "പോഷകക്കുറവ്",
        punjabi: "ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਕਮੀ",
        odia: "ପୋଷକ ତତ୍ତ୍ୱ ଅଭାବ"
    },
    UNCERTAIN: {
        english: "Uncertain",
        hindi: "अनिश्चित",
        tamil: "நிச்சಯமற்ற",
        telugu: "అనిశ్చిత",
        kannada: "ಅನಿಶ್ಚಿತ",
        bengali: "অনিশ্চিত",
        marathi: "अनिश्चित",
        gujarati: "અનિશ્ચિત",
        malayalam: "അനിശ്ചിത",
        punjabi: "ਅਨਿਸ਼ਚਿਤ",
        odia: "ଅନିଶ୍ଚିତ"
    }
};

// Start with english as default for fallback
export const getTranslatedText = (key: string, type: 'CROP' | 'STATUS', lang: string): string => {
    const dictionary = type === 'CROP' ? CROP_TRANSLATIONS : STATUS_TRANSLATIONS;
    const upperKey = key.toUpperCase();
    const entry = dictionary[upperKey];

    if (!entry) return key; // Return original if not found

    return entry[lang] || entry['english'] || key;
};
