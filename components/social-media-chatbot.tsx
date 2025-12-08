"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, X, MessageSquare, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface SocialMediaChatbotProps {
  userData?: any
}

export default function SocialMediaChatbot({ userData }: SocialMediaChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! 👋 Soy tu asistente de redes sociales con IA. Puedo ayudarte con consejos sobre cómo mejorar tu engagement, cuándo publicar, qué tipo de contenido crear, y mucho más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Agregar mensaje temporal del asistente
    const assistantMessageIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ])

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userData,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al obtener respuesta del chatbot")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No se pudo leer la respuesta")
      }

      let fullText = ""
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                buffer += parsed.text
              }
            } catch (e) {
              // Ignorar errores de parsing
            }
          }
        }
      }

      // Simular escritura con delay
      for (let i = 0; i < buffer.length; i++) {
        fullText += buffer[i]
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[assistantMessageIndex] = {
            role: "assistant",
            content: fullText,
            timestamp: new Date(),
          }
          return newMessages
        })
        // Delay entre caracteres (ajustable)
        await new Promise((resolve) => setTimeout(resolve, 20))
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[assistantMessageIndex] = {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
          timestamp: new Date(),
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50 border-0 overflow-hidden p-0">
      <CardHeader className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-4 m-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Asistente de Redes Sociales</CardTitle>
              <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" />
                Potenciado por IA
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white/90 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-blue-50/30 via-slate-50/50 to-white relative">
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef} onScroll={handleScroll}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarFallback
                    className={
                      message.role === "user"
                        ? "bg-slate-600 text-white"
                        : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                    }
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div
                    className={`rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-white text-slate-900 shadow-sm border border-slate-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs mt-1.5 px-2 text-slate-400">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-start max-w-[75%]">
                  <div className="rounded-2xl px-4 py-3 bg-white shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón para bajar al final */}
        {showScrollButton && (
          <div className="absolute bottom-28 right-8 z-10">
            <Button
              onClick={scrollToBottom}
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-slate-50 border border-slate-200"
            >
              <ArrowDown className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        )}

        <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef as any}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                // Auto-resize
                e.target.style.height = "auto"
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                  if (inputRef.current) {
                    inputRef.current.style.height = "auto"
                  }
                }
              }}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 max-h-[120px] overflow-y-auto"
              style={{ minHeight: "40px" }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl h-10 w-10 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2.5 text-center">
            💡 Consejos sobre estrategia, contenido y engagement
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
