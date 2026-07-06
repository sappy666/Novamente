import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, HelpCircle, Phone, ArrowRight, Bot, User, Loader2 } from "lucide-react";
import { ChatMessage } from "../types";

interface SpecialistChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

const QUICK_QUESTIONS = [
  "¿Cómo puedo agendar una hora?",
  "¿Cuáles son las especialidades del centro?",
  "¿Tienen reembolso para Isapre?",
  "Siento mucha ansiedad constante, ¿cómo me ayudan?"
];

export default function SpecialistChatDrawer({ isOpen, onClose, onOpenBooking }: SpecialistChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Qué gusto saludarte. Soy la especialista de orientación de Novamente. Entiendo que dar el primer paso para buscar apoyo terapéutico puede generar dudas, temores o emociones intensas.\n\nEstoy aquí en un espacio seguro, privado y sin juicios para escucharte, orientarte y ayudarte a encontrar el profesional adecuado para ti. ¿Cómo te has sentido últimamente o qué te gustaría consultarme hoy?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/specialist/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener respuesta del servidor.");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 11),
        role: "assistant",
        content: data.reply || "Disculpa, no pude procesar la respuesta. Por favor intenta de nuevo.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 11),
        role: "assistant",
        content: "Estimado/a, he experimentado un inconveniente de conexión momentáneo. Sin embargo, nuestro equipo de admisiones está siempre disponible para responder tus dudas de manera directa. Te invito a escribirnos a nuestro WhatsApp (+569 8821 2458) o agendar tu hora directamente presionando el botón de agendamiento en el sitio. ¡Estoy aquí para apoyarte!",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-deep-indigo/35 backdrop-blur-xs">
      {/* Semi-transparent Backdrop click triggers close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer Panel */}
      <div 
        className="w-full max-w-lg bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col border-l border-slate-100 dark:border-zinc-800 animate-slide-in"
        id="chat-drawer-panel"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 bg-primary/5 dark:bg-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                Especialista Novamente
                <span className="w-2 h-2 rounded-full bg-success-teal animate-pulse" />
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Orientación terapéutica con IA Empática</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info panel */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-zinc-800/20 text-[11px] text-zinc-500 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span>Toda conversación es privada y confidencial</span>
          <a 
            href="https://novamente.site.agendapro.com/cl/sucursal/180212"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Agendar hora <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Message history */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-zinc-950/20">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" 
                  ? "bg-secondary text-white" 
                  : "bg-primary/10 text-primary border border-primary/10"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="max-w-[80%] flex flex-col">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-secondary text-white rounded-tr-none"
                    : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 border border-slate-100 dark:border-zinc-800/80 rounded-tl-none shadow-xs"
                }`}>
                  {m.content}
                </div>
                <span className={`text-[10px] text-zinc-400 mt-1 ${m.role === "user" ? "text-right" : ""}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-zinc-800/80 shadow-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Escribiendo respuesta...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        {messages.length < 3 && !isLoading && (
          <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-primary" /> Preguntas sugeridas:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-xs text-left bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 py-2 px-3 rounded-full transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input panel */}
        <form 
          onSubmit={handleFormSubmit}
          className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Escribe tu consulta aquí..."
            className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-primary hover:bg-primary-container text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
