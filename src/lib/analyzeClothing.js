const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

const CATEGORY_LIST = [
  'Oberteil',
  'Pullover/Sweatshirt',
  'Hose/Rock',
  'Kleid',
  'Jacke/Mantel',
  'Thermolayer',
  'Schuhe',
  'Accessoire',
]

const PROMPT = `You are a clothing recognition assistant. Analyse this image and return a JSON object describing the clothing item.

Rules:
- "name": a short, specific English name (e.g. "Navy Denim Jacket", "White Linen Shirt")
- "category": must be EXACTLY one of: ${CATEGORY_LIST.join(', ')}
- "color": main color(s) in plain English (e.g. "Navy Blue", "Black & White Stripe")
- "tempMin": lowest comfortable temperature in °C (integer)
- "tempMax": highest comfortable temperature in °C (integer)
- "rain": true if the item is rain-appropriate (waterproof/water-resistant), false otherwise
- "gender": "all", "male", or "female"

Return ONLY valid JSON, no markdown, no explanation. Example:
{"name":"Navy Denim Jacket","category":"Jacke/Mantel","color":"Navy Blue","tempMin":8,"tempMax":18,"rain":false,"gender":"all"}`

export async function analyzeClothing(base64Image, mimeType = 'image/jpeg') {
  if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set in .env.local')

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType, data: base64Image } },
        ],
      }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Gemini API error ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  const parsed = JSON.parse(text)

  // Validate category falls back gracefully
  if (!CATEGORY_LIST.includes(parsed.category)) {
    parsed.category = 'Oberteil'
  }

  return {
    name:     parsed.name     ?? '',
    category: parsed.category,
    color:    parsed.color    ?? '',
    tempMin:  Number(parsed.tempMin ?? 10),
    tempMax:  Number(parsed.tempMax ?? 25),
    rain:     Boolean(parsed.rain),
    gender:   ['all', 'male', 'female'].includes(parsed.gender) ? parsed.gender : 'all',
  }
}
