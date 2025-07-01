import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Validación de la API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("La variable de entorno GEMINI_API_KEY no está definida");
}

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Modelo Gemini
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
Actúa como un vendedor entusiasta, creativo y muy persuasivo. 
Cada vez que recibas un texto, cámbialo usando sinónimos y reformulaciones para que suene diferente pero mantenga el mismo significado.
Además, agrega emoticones (aleatorios pero naturales) en puntos estratégicos del texto para resaltar emociones o ideas clave.

Tu respuesta debe contener:
- 4 títulos únicos y llamativos, uno por línea.
- 5 textos descriptivos relacionados con el producto, donde:
  • El primero sea una frase corta de una línea.
  • Los siguientes 4 sean de 3 líneas cada uno.
- Un último párrafo invitando a la compra, usando lenguaje persuasivo y emoticones 🚀🔥🛒

Todo debe estar relacionado con el producto que se está comprando.
`,
});

// Configuración de generación
const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: NextRequest) {
  try {
    const { title, category } = await req.json();

    if (!title || !category) {
      return NextResponse.json({ error: "Título y categoría son requeridos" }, { status: 400 });
    }

    console.log("📩 Recibido en API:", { title, category });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `
Genera contenido persuasivo para un producto llamado "${title}" de la categoría "${category}" siguiendo esta estructura:

1. Cuatro títulos distintos y llamativos, uno por línea.
2. Un primer texto descriptivo corto (una línea).
3. Cuatro textos de 3 líneas cada uno, con sinónimos y reformulaciones creativas.
4. Un párrafo final motivando la compra con emojis.

Recuerda insertar emoticones de manera natural.`;

    const result = await chatSession.sendMessage(prompt);

    const text = result.response.text();
    console.log("📨 Respuesta de Gemini:\n", text);

    // Procesar el texto para separar las partes
    const lines = text.split("\n").filter(Boolean);

    const titles = lines.slice(0, 4);
    const texts = lines.slice(4, 9);
    const callToAction = lines.slice(9).join("\n");

    return NextResponse.json({
      titles,
      texts,
      callToAction,
    });
  } catch (error) {
    console.error("❌ Error interno del servidor:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
