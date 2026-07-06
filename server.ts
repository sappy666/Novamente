import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini client to avoid crash if API key is not yet set
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing requests
  app.use(express.json());

  // API endpoint for empathetic specialist chatbot
  app.post("/api/specialist/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid request. 'messages' must be an array." });
        return;
      }

      const client = getGeminiClient();

      // We format the history for the chat API
      // Let's use the ai.chats.create API as guided by the gemini-api skill
      const systemInstruction = `
Eres la especialista de atención y orientación de "Novamente", un prestigioso Centro Terapéutico Profesional chileno.
Tu tono debe ser sumamente cálido, empático, profesional, respetuoso y contenedor. 
Las personas que te escriben pueden estar pasando por momentos de estrés, ansiedad, duda o vulnerabilidad. 
Tu misión es escucharlos con atención, validar sus emociones de forma amorosa y profesional, y orientarlos sobre cómo el centro Novamente puede ayudarlos en su camino hacia el bienestar emocional, físico y cognitivo.

Información clave sobre Novamente:
- **Especialidades disponibles**:
  1. Psicología: Para apoyo emocional, superación de fobias, ansiedad, depresión, manejo de estrés, trastornos de personalidad (como Borderline) y acompañamiento en crisis.
  2. Fonoaudiología: Evaluación y terapia para el lenguaje, habla, deglución y audición en niños y adultos.
  3. Psicopedagogía: Apoyo escolar, dificultades de aprendizaje y fortalecimiento cognitivo.
  4. Terapia Ocupacional: Promover la autonomía en las actividades diarias, integración sensorial y desarrollo motor/cognitivo.
- **Equipo de Coordinación**:
  - Cristi Carreño: Coordinadora Administrativa (velando por el bienestar y atención de cada paciente).
  - Joselyn Solis: Supervisora de Admisiones (guiando a las familias en su ingreso con total empatía).
  - Consuelo Guevara: Coordinadora Terapéutica (asegurando una atención cercana y efectiva).
- **Motivos de consulta comunes**: Fobias, Ansiedad, Depresión, Esquizofrenia, Ataques de Pánico, Estrés, Anorexia, Bulimia, Atracones, Trastorno Límite (Borderline).
- **Ubicación**: Av. Pedro de Valdivia # 291, oficina 101, Providencia, Santiago.
- **Contacto**: Teléfono +562 22457657, correo electrónico atencionpacientes@novamente.cl.
- **Agendamiento**: Ofrecemos agendamiento online directo a través de nuestro botón "Agendar hora" en el sitio (con el link de AgendaPro: https://novamente.site.agendapro.com/cl/sucursal/180212). Si el usuario desea agendar, indícale este link. Para cualquier duda, también contamos con el WhatsApp directo: https://wa.me/+56988212458.

Lineamientos de respuesta:
1. Responde siempre en español, con calidez y cercanía chilena pero profesional ("Hola, ¿cómo estás?", "Entiendo perfectamente lo que estás pasando", etc.).
2. No des diagnósticos médicos clínicos directos ni recetes medicamentos. Explica que la evaluación formal se realiza en sesión con uno de nuestros especialistas del equipo multidisciplinario.
3. Invita sutilmente al usuario a agendar una consulta en línea o contactarnos por WhatsApp o correo si desea dar el primer paso.
4. Mantén las respuestas relativamente breves y fluidas, estructuradas con párrafos limpios y acogedores. No uses tecnicismos exagerados, sé humana y cercana.
`;

      const chat = client.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // The gemini-api SDK allows using chat.sendMessage for sequential chatting or we can feed a message history.
      // Since client.chats.create starts a fresh chat, let's feed previous messages or simply generate content with history as part of contents.
      // Wait, let's look at the chat.sendMessage guidelines:
      // "chat.sendMessage only accepts the message parameter, do not use contents."
      // If we want to simulate a full chat session in a stateless endpoint, we can send the last message, 
      // or we can convert the messages array into the "contents" of a standard ai.models.generateContent call.
      // Let's do that! The contents array in ai.models.generateContent can represent the entire conversation history with roles "user" and "model" (or "user" and "model" roles as per standard Gemini API, wait! In Gemini API, the roles are "user" and "model").
      // Let's format the messages to match Gemini roles ("user" and "model"):
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "" });
    } catch (error: any) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({ error: error.message || "Error al procesar la solicitud con la especialista." });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
