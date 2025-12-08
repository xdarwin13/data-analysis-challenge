import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()

    // Parse CSV (improved parser with better handling)
    const lines = fileContent.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim())

    // Parse and clean raw data
    const rawData = lines.slice(1).map((line) => {
      const values = line.split(",")
      const obj: any = {}
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || ""
        
        // Detect numeric columns and convert
        if (["Likes", "Comentarios", "Compartidos", "Alcance", "Impresiones"].includes(header)) {
          const numValue = parseInt(value, 10)
          // Keep 0 as 0, but mark truly missing data as null
          obj[header] = value === "" || isNaN(numValue) ? null : numValue
        } else {
          obj[header] = value || null
        }
      })
      return obj
    })

    console.log("[v0] Parsed raw data:", rawData.length, "rows")
    
    // Pre-cleaning: Remove rows with null values in critical columns (0 is valid)
    const criticalColumns = ["Plataforma", "Tipo", "Likes", "Comentarios", "Compartidos", "Alcance", "Impresiones"]
    const originalRowCount = rawData.length
    
    const cleanedRawData = rawData.filter((row) => {
      // Check if all critical columns have valid values
      return criticalColumns.every((col) => {
        const value = row[col]
        // Accept 0 as valid, but reject null, undefined, or empty string
        return value !== null && value !== undefined && value !== ""
      })
    })
    
    const rowsRemovedDueToNulls = originalRowCount - cleanedRawData.length
    
    console.log("[v0] Cleaned data:", cleanedRawData.length, "rows (removed", rowsRemovedDueToNulls, "rows with nulls)")

    // Use Groq AI to clean and analyze data
    const prompt = `Eres un experto analista de datos de redes sociales. Analiza estos datos y proporciona:

IMPORTANTE - Reglas de limpieza:
1. ELIMINA COMPLETAMENTE las filas que tengan valores null o vacíos en columnas críticas (Likes, Comentarios, Compartidos, Alcance, Impresiones, Plataforma, Tipo)
2. Si un valor numérico es 0, es VÁLIDO (significa sin interacción pero es dato real) - NO lo elimines
3. SOLO mantén filas con datos completos (valores pueden ser 0, pero no null ni vacío)
4. Normaliza fechas al formato YYYY-MM-DD
5. Convierte números a formato numérico (no strings)
6. Elimina filas duplicadas completamente
7. Para cálculos de engagement, usa: ((Likes + Comentarios + Compartidos) / Alcance) * 100
8. Si Alcance es 0, el engagement será infinito - marca como null en ese caso
9. Identifica y elimina outliers extremos (valores sospechosamente altos)

Datos pre-limpiados (primeras 50 filas - ya se eliminaron ${rowsRemovedDueToNulls} filas con valores nulos):
${JSON.stringify(cleanedRawData.slice(0, 50), null, 2)}

Total de filas originales: ${originalRowCount}
Filas después de limpieza inicial: ${cleanedRawData.length}

Responde SOLO con un JSON válido en este formato exacto:
{
  "cleanedData": [
    {
      "Fecha": "YYYY-MM-DD",
      "Hora": "HH:MM",
      "Plataforma": "string",
      "Tipo": "string",
      "Likes": number | null,
      "Comentarios": number | null,
      "Compartidos": number | null,
      "Alcance": number | null,
      "Impresiones": number | null,
      "EngagementRate": number | null
    }
  ],
  "summary": {
    "totalPosts": number,
    "avgEngagement": "X.XX%",
    "bestDay": "string",
    "bestHour": "HH:MM",
    "totalLikes": number,
    "totalComments": number,
    "totalShares": number,
    "totalReach": number,
    "totalImpressions": number,
    "dataQuality": {
      "totalRowsOriginal": number,
      "cleanRows": number,
      "rowsWithNullsRemoved": number,
      "duplicatesRemoved": number,
      "totalRowsRemoved": number
    }
  },
  "charts": {
    "byDay": [{"day": "Lunes", "engagement": number}, ...],
    "byHour": [{"hour": "10:00", "engagement": number}, ...],
    "byContentType": [{"name": "Video", "value": number}, {"name": "Imagen", "value": number}, ...],
    "trendOverTime": [{"period": "Semana 1", "engagement": number}, ...],
    "byPlatform": [{"platform": "Instagram", "engagement": number, "reach": number}, ...]
  },
  "topPosts": [{"type": "string", "date": "string", "likes": number, "comments": number, "engagement": number}, ...],
  "recommendations": [{"title": "string", "description": "string"}, ...]
}`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Eres un experto analista de datos. Respondes SOLO con JSON válido, sin texto adicional.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const aiResponse = completion.choices[0]?.message?.content || ""
    console.log("[v0] AI Response length:", aiResponse.length)

    // Parse AI response
    let result
    try {
      // Extract JSON if wrapped in markdown
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse
      result = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response:", parseError)
      // Fallback to basic analysis
      result = {
        cleanedData: cleanedRawData,
        summary: {
          totalPosts: cleanedRawData.length,
          avgEngagement: "N/A",
          bestDay: "N/A",
          bestHour: "N/A",
          dataQuality: {
            totalRowsOriginal: originalRowCount,
            cleanRows: cleanedRawData.length,
            rowsWithNullsRemoved: rowsRemovedDueToNulls,
            duplicatesRemoved: 0,
            totalRowsRemoved: rowsRemovedDueToNulls,
          },
        },
        charts: {
          byDay: [],
          byHour: [],
        },
        topPosts: [],
        recommendations: [
          {
            title: "Datos procesados",
            description:
              "Tus datos han sido cargados y limpiados. Se eliminaron " + rowsRemovedDueToNulls + " filas con valores nulos.",
          },
        ],
      }
    }

    // CRITICAL: Ensure totalPosts matches the actual cleaned data count
    // The AI might remove additional duplicates, so we need to sync the count
    if (result.cleanedData && Array.isArray(result.cleanedData)) {
      const actualCleanedCount = result.cleanedData.length
      
      if (!result.summary) {
        result.summary = {}
      }
      
      // Update totalPosts to match actual cleaned data
      result.summary.totalPosts = actualCleanedCount
      
      // Update data quality metrics to match reality
      if (result.summary.dataQuality) {
        result.summary.dataQuality.cleanRows = actualCleanedCount
        const totalRemoved = originalRowCount - actualCleanedCount
        result.summary.dataQuality.totalRowsRemoved = totalRemoved
        result.summary.dataQuality.duplicatesRemoved = totalRemoved - rowsRemovedDueToNulls
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error processing data:", error)
    return NextResponse.json({ error: "Error al procesar los datos" }, { status: 500 })
  }
}
