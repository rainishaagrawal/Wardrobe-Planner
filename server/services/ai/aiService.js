const { GEMINI_API_KEY } = require('../../config/env');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { analyzeClothing: mockAnalyzeClothing } = require('./clothingAnalyzer');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const analyzeClothing = async (itemData) => {
  if (!GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY found, falling back to mock clothing analyzer.");
    return mockAnalyzeClothing(itemData);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash", generationConfig: { responseMimeType: "application/json" } });
    
    let parts = [];
    let prompt = `Analyze this clothing item and return a JSON object ONLY with exactly these keys and matching strict types (no markdown formatting outside of JSON):
    {
      "category": "top" | "bottom" | "dress" | "outerwear" | "shoes" | "accessory",
      "subcategory": "string (e.g. t-shirt, jeans, blazer)",
      "primaryColor": "string (e.g. black, blue)",
      "secondaryColors": ["string"],
      "pattern": "string (e.g. solid, stripes, plaid)",
      "material": "string (e.g. cotton, denim, leather)",
      "fit": "string (e.g. slim, relaxed, oversized)",
      "formality": "casual" | "smartCasual" | "formal",
      "season": ["summer", "winter", "spring", "autumn", "all"],
      "weatherSuitability": {
        "minTemperature": number,
        "maxTemperature": number,
        "rainSuitable": boolean
      },
      "aesthetics": ["casual", "streetwear", "minimal", "vintage", "smartCasual"],
      "genderNeutral": boolean,
      "confidence": number (between 0.0 and 1.0)
    }`;

    // If an image URL is provided, fetch it and pass to Gemini Vision
    if (itemData.imageUrl && itemData.imageUrl.startsWith('http')) {
      prompt = "Analyze the provided clothing image and return its characteristics in JSON." + prompt;
      
      try {
        const imageResp = await fetch(itemData.imageUrl);
        const arrayBuffer = await imageResp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';
        
        parts.push({
          inlineData: {
            data: buffer.toString("base64"),
            mimeType
          }
        });
      } catch (imgErr) {
        console.error("Failed to fetch image for Gemini, falling back to text-only analysis:", imgErr);
        prompt += `\nItem name: ${itemData.name}\nCategory: ${itemData.category}`;
      }
    } else {
      prompt += `\nItem name: ${itemData.name}\nCategory: ${itemData.category}`;
    }

    parts.unshift({ text: prompt });

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    
    // Parse the JSON
    let parsedResult;
    try {
      // In case it returns with ```json ... ```
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Gemini returned invalid JSON:", responseText);
      return mockAnalyzeClothing(itemData); // fallback
    }

    // Ensure valid category fallback
    const validCategories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'];
    if (!validCategories.includes(parsedResult.category)) {
      parsedResult.category = itemData.category || 'top';
    }

    return parsedResult;
  } catch (error) {
    console.error("Gemini API Error, falling back to mock:", error);
    return mockAnalyzeClothing(itemData);
  }
};

module.exports = { analyzeClothing };
