
export const DISEASE_DATA: Record<string, any> = {
    LEAF_SPOT: {
        english: { name: "Leaf Spot", description: "Brown spots on leaves indicated fungal infection.", recommendations: ["Apply Copper Fungicide", "Use Neem Oil spray"], precautions: ["Avoid overhead watering, Remove infected leaves"] },
        hindi: { name: "पत्ती धब्बा", description: "पत्तियों पर भूरे धब्बे फंगल संक्रमण का संकेत देते हैं।", recommendations: ["कॉपर फंगसाइड का प्रयोग करें", "नीम के तेल का छिड़काव करें"], precautions: ["ऊपर से पानी देने से बचें", "संक्रमित पत्तियों को हटा दें"] },
        telugu: { name: "ఆకు మచ్చ తెగులు", description: "ఆకులపై గోధుమ రంగు మచ్చలు ఫంగల్ ఇన్ఫెక్షన్‌ను సూచిస్తాయి.", recommendations: ["రాగి ఫంగైసైడ్ వాడండి", " వేప నూనె పిచికారీ చేయండి"], precautions: ["పై నుండి నీరు పోయడం మానుకోండి", "వ్యాధి సోకిన ఆకులను తొలగించండి"] },
        tamil: { name: "இலை புள்ளி நோய்", description: "இலைகளில் உள்ள பழுப்புப் புள்ளிகள் பூஞ்சை தொற்றைக் குறிக்கின்றன.", recommendations: ["காப்பர் பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும்", "வேப்ப எண்ணெய் தெளிக்கவும்"], precautions: ["தலைக்கு மேல் நீர் பாய்ச்சுவதைத் தவிர்க்கவும்", "பாதிக்கப்பட்ட இலைகளை அகற்றவும்"] }
    },
    BLIGHT: {
        english: { name: "Blight", description: "Rapid browning and wilting of leaves, stems, or flowers.", recommendations: ["Use Carbendazim", "Apply Mancozeb"], precautions: ["Ensure proper drainage", "Use resistant seeds"] },
        hindi: { name: "झुलसा रोग", description: "पत्तियों, तनों या फूलों का तेजी से भूरा होना और मुरझाना।", recommendations: ["कार्बेंडाजिम का उपयोग करें", "मैंकोजेब का प्रयोग करें"], precautions: ["उचित जल निकासी सुनिश्चित करें", "प्रतिरोधी बीजों का उपयोग करें"] },
        telugu: { name: "మాడు తెగులు", description: "ఆకులు, కాండం లేదా పువ్వులు వేగంగా వాడిపోతాయి.", recommendations: ["కార్బెండజిమ్ వాడండి", "మాంకోజెబ్ వర్తించండి"], precautions: ["సరైన నీటి పారుదల ఉండేలా చూసుకోండి", "నిరోధక విత్తనాలను వాడండి"] },
        tamil: { name: "கருகல் நோய்", description: "இலைகள், தண்டுகள் அல்லது பூக்கள் வேகமாக பழுத்து வாடுதல்.", recommendations: ["கார்பென்டாசிம் பயன்படுத்தவும்", "மேன்கோசெப் பயன்படுத்தவும்"], precautions: ["சரியான வடிகால் வசதியை உறுதி செய்யவும்", "நோய் எதிர்ப்பு விதைகளைப் பயன்படுத்தவும்"] }
    },
    RUST: {
        english: { name: "Rust", description: "Rust-colored pustules on leaves affecting growth.", recommendations: ["Apply Propiconazole", "Use Sulfur Dust"], precautions: ["Avoid nitrogen excess", "Clean equipment"] },
        hindi: { name: "रतुआ रोग", description: "पत्तियों पर जंग के रंग के फफोले जो विकास को प्रभावित करते हैं।", recommendations: ["प्रोपिकोनाज़ोल का प्रयोग करें", "सल्फर डस्ट का उपयोग करें"], precautions: ["नाइट्रोजन की अधिकता से बचें", "उपकरणों को साफ करें"] },
        telugu: { name: "తుప్పు తెగులు", description: "ఆకులపై తుప్పు రంగు మచ్చలు పెరుగుదలను ప్రభావితం చేస్తాయి.", recommendations: ["ప్రోపికొనజోల్ వాడండి", "సల్ఫర్ డస్ట్ వాడండి"], precautions: ["నైట్రోజన్ ఎక్కువగా వాడకండి", "పరికరాలను శుభ్రం చేయండి"] },
        tamil: { name: "துரு நோய்", description: "வளர்ச்சியை பாதிக்கும் இலைகளில் துரு நிற கொப்புளங்கள்.", recommendations: ["புரோபிகோனசோல் பயன்படுத்தவும்", "கந்தகத் தூளைப் பயன்படுத்தவும்"], precautions: ["நைட்ரஜன் அதிகப்படியைத் தவிர்க்கவும்", "கருவிகளைச் சுத்தம் செய்யவும்"] }
    },
    POWDERY_MILDEW: {
        english: { name: "Powdery Mildew", description: "White powdery coating on leaves causing curling.", recommendations: ["Use Potassium Bicarbonate", "Apply Triforine"], precautions: ["Prune affected areas", "Keep leaves dry"] },
        hindi: { name: "चूर्णी फफूंद", description: "पत्तियों पर सफेद चूर्ण जैसी परत जिससे पत्तियां मुड़ जाती हैं।", recommendations: ["पोटेशियम बाइकार्बोनेट का उपयोग करें", "ट्राइफोरिन का प्रयोग करें"], precautions: ["प्रभावित क्षेत्रों की छंटाई करें", "पत्तियों को सूखा रखें"] },
        telugu: { name: "బూడిద తెగులు", description: "ఆకులపై తెల్లటి పొడి పూత ఆకులు ముడుచుకుపోయేలా చేస్తుంది.", recommendations: ["పొటాషియం బైకార్బోనేట్ వాడండి", "ట్రిపోరిన్ వర్తించండి"], precautions: ["ప్రభావిత ప్రాంతాలను కత్తిరించండి", "ఆకులు పొడిగా ఉంచండి"] },
        tamil: { name: "சாம்பல் நோய்", description: "இலைகளில் வெள்ளை தூள் பூச்சு சுருட்டுவதற்கு காரணமாகிறது.", recommendations: ["பொటాசியம் பைகார்பனேட் பயன்படுத்தவும்", "ட்ரைஃபோரின் பயன்படுத்தவும்"], precautions: ["பாதிக்கப்பட்ட பகுதிகளை கத்தரிக்கவும்", "இலைகளை உலர வைக்கவும்"] }
    },
    LEAF_CURL: {
        english: { name: "Leaf Curl Virus", description: "Leaves curl upwards or downwards, stunted growth.", recommendations: ["Use Imidacloprid for vectors", "Remove infected plants"], precautions: ["Control whiteflies/aphids", "Use virus-free seeds"] },
        hindi: { name: "पत्ती मरोड़ रोग", description: "पत्तियां ऊपर या नीचे की ओर मुड़ जाती हैं, पौधे का विकास रुक जाता है।", recommendations: ["इमिडाक्लोप्रिड का उपयोग करें", "संक्रमित पौधों को हटा दें"], precautions: ["सफेद मक्खी/एफिड्स को नियंत्रित करें", "वायरस मुक्त बीजों का उपयोग करें"] },
        telugu: { name: "ఆకు ముడత వైరస్", description: "ఆకులు పైకి లేదా క్రిందికి ముడుచుకుంటాయి, పెరుగుదల కుంటుపడుతుంది.", recommendations: ["ఇమిడాక్లోప్రిడ్ వాడండి", "వ్యాధి సోకిన మొక్కలను తొలగించండి"], precautions: ["తెల్ల దోమ/పేనుబంకను నివారించండి", "వైరస్ లేని విత్తనాలను వాడండి"] },
        tamil: { name: "இலை சுருள் நோய்", description: "இலைகள் மேல் அல்லது கீழ் நோக்கி சுருள்கின்றன, வளர்ச்சி குன்றுகிறது.", recommendations: ["இமிடாக்ளோப்ரிட் பயன்படுத்தவும்", "பாதிக்கப்பட்ட செடிகளை அகற்றவும்"], precautions: ["வெள்ளை ஈக்கள்/அசுவினியை கட்டுப்படுத்தவும்", "நோய் இல்லாத விதைகளைப் பயன்படுத்தவும்"] }
    },
    WILT: {
        english: { name: "Wilt", description: "Plant droops suddenly due to blocked water transport.", recommendations: ["Use Trichoderma", "Improve drainage"], precautions: ["Crop rotation", "Avoid waterlogging"] },
        hindi: { name: "उकठा रोग (Wilt)", description: "पानी का संचार रुकने से पौधा अचानक मुरझा जाता है।", recommendations: ["ट्राइकोडर्मा का उपयोग करें", "जल निकासी में सुधार करें"], precautions: ["फसल चक्र अपनाएं", "जलभराव से बचें"] },
        telugu: { name: "ఎండు తెగులు", description: "నీటి సరఫరా ఆగిపోవడం వల్ల మొక్క అకస్మాత్తుగా వాడిపోతుంది.", recommendations: ["ట్రైకోడెర్మా వాడండి", "నీటి పారుదల మెరుగుపరచండి"], precautions: ["పంట మార్పిడి చేయండి", "నీరు నిల్వ ఉండకుండా చూడండి"] },
        tamil: { name: "வாடல் நோய்", description: "நீர் போக்குவரத்து தடைபடுவதால் தாவரம் திடீரென வாடுகிறது.", recommendations: ["ட்ரைக்கோடெர்மா பயன்படுத்தவும்", "வடிகால் வசதியை மேம்படுத்தவும்"], precautions: ["பயிர் சுழற்சி", "நீர் தேங்குவதைத் தவிர்க்கவும்"] }
    },
    UNKNOWN: {
        english: { name: "Unknown Issue", description: "Unidentified issue. Please consult an expert.", recommendations: ["Consult generic expert", "Monitor closely"], precautions: ["Isolate plant", "Maintain hygiene"] },
        hindi: { name: "अज्ञात समस्या", description: "अज्ञात समस्या। कृपया किसी विशेषज्ञ से मिलें।", recommendations: ["विशेषज्ञ से सलाह लें", "बारीकी से निगरानी करें"], precautions: ["पौधे को अलग रखें", "सफाई बनाए रखें"] },
        telugu: { name: "తెలియని సమస్య", description: "గుర్తించబడని సమస్య. దయచేసి నిపుణుడిని సంప్రదించండి.", recommendations: ["నిపుణుడిని సంప్రదించండి", "నిశితంగా గమనించండి"], precautions: ["మొక్కను వేరుగా ఉంచండి", "పరిశుభ్రత పాటించండి"] },
        tamil: { name: "தெரியாத பிரச்சனை", description: "அடையாளம் காணப்படாத பிரச்சனை. நிபுணரை அணுகவும்.", recommendations: ["நிபுணரை அணுகவும்", "நெருக்கமாக கண்காணிக்கவும்"], precautions: ["தாவரத்தை தனிமைப்படுத்தவும்", "சுகாதாரத்தை பராமரிக்கவும்"] }
    }
};

export const getDiseaseInfo = (key: string | undefined, lang: string) => {
    let normalized = (key || 'UNKNOWN').toUpperCase().replace(/\s+/g, '_');

    // Fuzzy matching for backend variations
    if (normalized.includes('LEAF_SPOT')) normalized = 'LEAF_SPOT';
    else if (normalized.includes('BLIGHT')) normalized = 'BLIGHT';
    else if (normalized.includes('RUST')) normalized = 'RUST';
    else if (normalized.includes('MILDEW')) normalized = 'POWDERY_MILDEW';
    else if (normalized.includes('LEAF_CURL')) normalized = 'LEAF_CURL';
    else if (normalized.includes('WILT')) normalized = 'WILT';

    // Fallback logic handled by checking if key exists
    if (!DISEASE_DATA[normalized]) normalized = 'UNKNOWN';

    const entry = DISEASE_DATA[normalized] || DISEASE_DATA['UNKNOWN'];

    const l = lang.toLowerCase();
    const fallback = 'english';
    return entry[l] || entry[fallback] || entry['english'];
};
