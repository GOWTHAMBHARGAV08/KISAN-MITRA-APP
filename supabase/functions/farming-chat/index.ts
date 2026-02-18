import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, imageBase64, language, mode } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    // mode: "analyze" for plant health analyzer, default for chatbot
    if (mode === "analyze" && imageBase64) {
      const result = await analyzePlantImage(GROQ_API_KEY, imageBase64, message);
      // Return JSON object directly
      return new Response(JSON.stringify({ response: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (imageBase64) {
      const result = await chatWithImage(GROQ_API_KEY, imageBase64, message, language);
      return new Response(JSON.stringify({ response: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await chatWithAI(GROQ_API_KEY, message, language);
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("farming-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callGroq(apiKey: string, messages: any[], model = "llama-3.3-70b-versatile"): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature: 0.2 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Groq API error:", response.status, errText);
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    throw new Error("AI service error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Unable to generate response.";
}

async function callGroqVision(apiKey: string, messages: any[]): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.2-90b-vision-preview", // Updated to better vision model
      messages,
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Groq Vision API error:", response.status, errText);
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    throw new Error("AI vision service error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Unable to generate response.";
}

// Helper to sanitize JSON string
function extractJSON(text: string): any {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found");
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }
}

async function analyzePlantImage(apiKey: string, imageBase64: string, userMessage?: string): Promise<any> {

  // Step 1: Plant Identification
  const idPrompt = `
    Identify the plant in this image.
    Return ONLY a valid JSON object with this exact structure:
    {
      "plantName": "Standardized ID of the plant (e.g. RICE, WHEAT, TOMATO, COTTON, MAIZE, CHILLI, etc.) in UPPERCASE.",
      "isLeaf": true, // true ONLY if it is a clear leaf or plant part suitable for diagnosis
      "confidence": 85 // number 0-100 reflecting certainty
    }
    If the image is not a plant or is too blurry to identify, set isLeaf to false and plantName to "UNKNOWN".
  `;

  const idMessages = [
    {
      role: "user", content: [
        { type: "text", text: idPrompt },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    }
  ];

  let plantIdentity;
  try {
    const idResult = await callGroqVision(apiKey, idMessages);
    plantIdentity = extractJSON(idResult);
  } catch (e) {
    console.error("Plant ID parse error", e);
    return {
      error: "Failed to process image for identification. Please try again.",
      plantName: "Unknown", confidence: 0
    };
  }

  // VALIDATION: Check confidence and if it's a leaf
  // User Requirement: If plant confidence score is below 70%, return specific error.
  if (!plantIdentity.isLeaf || (plantIdentity.confidence < 70)) {
    return {
      error: "Unable to confidently identify crop. Please upload a clearer leaf image.",
      plantName: plantIdentity.plantName || "Unknown",
      confidence: plantIdentity.confidence || 0,
      status: "uncertain"
    };
  }

  // Step 2: Disease Diagnosis (Scoped to identified plant)
  const diseasePrompt = `
    You are an expert plant pathologist. The plant has been identified as ${plantIdentity.plantName}.
    Analyze the image for diseases, pests, or nutrient deficiencies SPECIFIC to ${plantIdentity.plantName}.
    Return ONLY a valid JSON object with this structure:
    {
      "status": "HEALTHY" | "DISEASED" | "PEST" | "NUTRIENT_DEFICIENCY",
    "diseaseDetected": "Specific Disease Name in English (e.g. Chilli Leaf Curl Virus, Rice Blast, Early Blight). If healthy, null.",
      "diseaseId": "Standardized ID from list: [LEAF_SPOT, BLIGHT, RUST, POWDERY_MILDEW, LEAF_CURL, WILT, ROOT_ROT, FRUIT_BORER, APHIDS, THRIPS, MITES, NUTRIENT_DEFICIENCY, UNKNOWN]. If healthy, HEALTHY.",
      "confidence": 90, // number 0-100 reflecting diagnosis certainty
      "description": "Short problem description (max 2 sentences).",
      "recommendations": ["Immediate action 1", "Immediate action 2"],
      "precautions": ["Preventive measure 1", "Preventive measure 2"],
      "severity": "low" | "medium" | "high"
    }
    Always include: "Consult a local agriculture officer before heavy chemical use." in precautions.
  `;

  const diseaseMessages = [
    {
      role: "user", content: [
        { type: "text", text: diseasePrompt },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    }
  ];

  let diagnosis;
  try {
    const diseaseResult = await callGroqVision(apiKey, diseaseMessages);
    diagnosis = extractJSON(diseaseResult);
  } catch (e) {
    console.error("Disease diagnosis parse error", e);
    return {
      error: "Failed to diagnose disease. Please try again.",
      plantName: plantIdentity.plantName
    };
  }

  // Formatting result
  const result = {
    plantName: plantIdentity.plantName,
    plantConfidence: plantIdentity.confidence,
    status: diagnosis.status,
    diseaseDetected: diagnosis.diseaseDetected,
    confidence: diagnosis.confidence,
    description: diagnosis.description,
    recommendations: diagnosis.recommendations,
    precautions: diagnosis.precautions,
    severity: diagnosis.severity
  };

  // User Requirement: If disease confidence is below 65%, show “Possible condition detected. Please verify.”
  if (result.confidence < 65 && result.status !== 'healthy') {
    result.description = "Possible condition detected. Please verify. " + result.description;
  }

  return result;
}

async function chatWithImage(apiKey: string, imageBase64: string, message: string, language: string): Promise<string> {
  const languageMap: Record<string, string> = {
    english: "English", hindi: "Hindi", tamil: "Tamil", telugu: "Telugu",
    kannada: "Kannada", bengali: "Bengali", marathi: "Marathi",
    gujarati: "Gujarati", malayalam: "Malayalam", punjabi: "Punjabi", odia: "Odia",
  };
  const langName = languageMap[language] || "English";

  const messages = [
    {
      role: "system",
      content: `You are KisanMitra, an AI farming assistant for Indian farmers. Respond in ${langName} language. Analyze any plant/crop images shared and provide helpful, practical farming advice. If disease is detected, provide cause, prevention, and treatment. Always add: "Consult a local agriculture officer before heavy chemical use."`,
    },
    {
      role: "user",
      content: [
        { type: "text", text: message || "Please analyze this image" },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
      ],
    },
  ];

  return await callGroqVision(apiKey, messages);
}

async function chatWithAI(apiKey: string, message: string, language: string): Promise<string> {
  const languageMap: Record<string, string> = {
    english: "English", hindi: "Hindi", tamil: "Tamil", telugu: "Telugu",
    kannada: "Kannada", bengali: "Bengali", marathi: "Marathi",
    gujarati: "Gujarati", malayalam: "Malayalam", punjabi: "Punjabi", odia: "Odia",
  };
  const langName = languageMap[language] || "English";

  const messages = [
    {
      role: "system",
      content: `You are KisanMitra, an AI farming assistant specializing in Indian agriculture. Respond in ${langName} language. Provide helpful, practical advice about farming, crops, weather, pest control, fertilizers, and agricultural practices. Keep responses concise and farmer-friendly.`,
    },
    { role: "user", content: message },
  ];

  return await callGroq(apiKey, messages);
}
