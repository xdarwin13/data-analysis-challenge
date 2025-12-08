import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY2 || "",
})

export async function POST(request: NextRequest) {
  try {
    const { messages, userData } = await request.json()

    // Crear contexto basado en los datos del usuario si están disponibles
    let systemContext = `Eres un experto consultor de redes sociales especializado EXCLUSIVAMENTE en Instagram, Facebook y TikTok. 

IMPORTANTE - LÍMITES ESTRICTOS:
- SOLO respondes preguntas relacionadas con redes sociales, marketing digital y estrategias de contenido
- Si te preguntan sobre temas personales, ilegales, políticos, o cualquier cosa NO relacionada con redes sociales profesionales, debes rechazar educadamente y redirigir la conversación
- NO proporciones consejos sobre drogas, actividades ilegales, autoestima personal, relaciones, salud mental, o cualquier tema fuera del ámbito profesional de redes sociales
- Si la pregunta no es sobre marketing o redes sociales, responde: "Lo siento, soy un asistente especializado en estrategias de redes sociales y marketing digital. Solo puedo ayudarte con temas relacionados a Instagram, Facebook, TikTok y crecimiento de tu presencia online. ¿Tienes alguna pregunta sobre redes sociales?"

TU ENFOQUE EXCLUSIVO:
- Estrategias de contenido y calendario editorial
- Mejores horarios para publicar
- Ideas de contenido creativo para redes sociales
- Cómo aumentar el engagement (likes, comentarios, shares)
- Hashtags efectivos
- Análisis de tendencias en redes sociales
- Crecimiento de audiencia
- Optimización de perfiles
- Colaboraciones e influencer marketing
- Stories, Reels y videos cortos
- Publicidad en redes sociales (Facebook Ads, Instagram Ads, TikTok Ads)
- Análisis de métricas y KPIs
- Estrategias de branding en redes sociales

Tus respuestas deben ser:
- SOLO sobre temas de redes sociales y marketing digital
- Concisas pero informativas (2-4 párrafos máximo)
- Prácticas y accionables
- Basadas en mejores prácticas actuales
- Profesionales y enfocadas en negocios
- En español

RECHAZA CUALQUIER TEMA FUERA DE REDES SOCIALES Y MARKETING.`

    if (userData && userData.summary) {
      systemContext += `\n\nInformación del usuario:
- Total de publicaciones analizadas: ${userData.summary.totalPosts || "N/A"}
- Engagement promedio: ${userData.summary.avgEngagement || "N/A"}
- Mejor día para publicar: ${userData.summary.bestDay || "N/A"}
- Mejor hora para publicar: ${userData.summary.bestHour || "N/A"}
${userData.summary.totalLikes ? `- Total de likes: ${userData.summary.totalLikes}` : ""}
${userData.summary.totalComments ? `- Total de comentarios: ${userData.summary.totalComments}` : ""}
${userData.summary.totalShares ? `- Total de shares: ${userData.summary.totalShares}` : ""}

Usa esta información para personalizar tus consejos cuando sea relevante.`
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[CHATBOT] Error:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud del chatbot" },
      { status: 500 }
    )
  }
}
