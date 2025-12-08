"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUpload from "@/components/file-upload"
import DataPreview from "@/components/data-preview"
import DataAnalysis from "@/components/data-analysis"
import SampleDataDownload from "@/components/sample-data-download"
import SocialMediaChatbot from "@/components/social-media-chatbot"

export default function DashboardPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [cleanedData, setCleanedData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setError(null)
    setIsProcessing(true)
    setProcessingStep("Leyendo archivo...")

    try {
      // Read and process file
      const formData = new FormData()
      formData.append("file", file)

      setProcessingStep("Limpiando datos con IA...")
      const response = await fetch("/api/clean-data", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al procesar el archivo")
      }

      const result = await response.json()
      setCleanedData(result)
      setProcessingStep("Completado")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el archivo")
      console.error("[v0] Error processing file:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">DataPulse</span>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Análisis</h1>
          <p className="text-slate-600">Sube tus datos de redes sociales y obtén insights potenciados por IA</p>
        </div>

        {!cleanedData ? (
          <div className="max-w-4xl mx-auto">
            {/* Upload Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Subir datos
                    </CardTitle>
                    <CardDescription>
                      Sube un archivo CSV o Excel con tus datos de redes sociales (Instagram, Facebook, TikTok)
                    </CardDescription>
                  </div>
                  <SampleDataDownload />
                </div>
              </CardHeader>
              <CardContent>
                <FileUpload onFileSelect={handleFileUpload} isProcessing={isProcessing} />

                {isProcessing && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{processingStep}</span>
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                    </div>
                    <Progress value={processingStep.includes("Completado") ? 100 : 66} />
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>¿Qué datos necesitas?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Fecha y hora de publicación</h4>
                    <p className="text-sm text-slate-600">Para identificar los mejores momentos para publicar</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Métricas de engagement</h4>
                    <p className="text-sm text-slate-600">Likes, comentarios, compartidos, alcance, impresiones</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Tipo de contenido</h4>
                    <p className="text-sm text-slate-600">Imagen, video, carrusel, historia, etc.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Plataforma</h4>
                    <p className="text-sm text-slate-600">Instagram, Facebook o TikTok</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Vista general</TabsTrigger>
              <TabsTrigger value="data">Datos limpios</TabsTrigger>
              <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPIs Section - Expanded */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Total Publicaciones</p>
                        <p className="text-3xl font-bold text-blue-900">{cleanedData.summary?.totalPosts || 0}</p>
                        <p className="text-xs text-blue-600 mt-1">Este período</p>
                      </div>
                      <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium mb-1">Engagement Promedio</p>
                        <p className="text-3xl font-bold text-green-900">
                          {cleanedData.summary?.avgEngagement || "0%"}
                        </p>
                        <p className="text-xs text-green-600 mt-1">Por publicación</p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium mb-1">Mejor Día</p>
                        <p className="text-3xl font-bold text-purple-900">{cleanedData.summary?.bestDay || "N/A"}</p>
                        <p className="text-xs text-purple-600 mt-1">Mayor rendimiento</p>
                      </div>
                      <Clock className="w-10 h-10 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-cyan-700 font-medium mb-1">Mejor Hora</p>
                        <p className="text-3xl font-bold text-cyan-900">{cleanedData.summary?.bestHour || "N/A"}</p>
                        <p className="text-xs text-cyan-600 mt-1">Pico de engagement</p>
                      </div>
                      <Target className="w-10 h-10 text-cyan-600" />
                    </div>
                  </CardContent>
                </Card>

                {cleanedData.summary?.totalLikes && (
                  <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-700 font-medium mb-1">Total Likes</p>
                          <p className="text-3xl font-bold text-red-900">
                            {cleanedData.summary.totalLikes.toLocaleString()}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Promedio: {Math.round(cleanedData.summary.totalLikes / (cleanedData.summary.totalPosts || 1))}
                          </p>
                        </div>
                        <Heart className="w-10 h-10 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {cleanedData.summary?.totalComments && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-700 font-medium mb-1">Total Comentarios</p>
                          <p className="text-3xl font-bold text-blue-900">
                            {cleanedData.summary.totalComments.toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Promedio: {Math.round(cleanedData.summary.totalComments / (cleanedData.summary.totalPosts || 1))}
                          </p>
                        </div>
                        <MessageCircle className="w-10 h-10 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {cleanedData.summary?.totalShares && (
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-700 font-medium mb-1">Total Compartidos</p>
                          <p className="text-3xl font-bold text-emerald-900">
                            {cleanedData.summary.totalShares.toLocaleString()}
                          </p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Promedio: {Math.round(cleanedData.summary.totalShares / (cleanedData.summary.totalPosts || 1))}
                          </p>
                        </div>
                        <Share2 className="w-10 h-10 text-emerald-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {cleanedData.summary?.totalReach && (
                  <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-700 font-medium mb-1">Alcance Total</p>
                          <p className="text-3xl font-bold text-orange-900">
                            {cleanedData.summary.totalReach.toLocaleString()}
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            Promedio: {Math.round(cleanedData.summary.totalReach / (cleanedData.summary.totalPosts || 1))}
                          </p>
                        </div>
                        <Eye className="w-10 h-10 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {cleanedData.summary?.totalImpressions && (
                  <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-violet-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-violet-700 font-medium mb-1">Impresiones Totales</p>
                          <p className="text-3xl font-bold text-violet-900">
                            {cleanedData.summary.totalImpressions.toLocaleString()}
                          </p>
                          <p className="text-xs text-violet-600 mt-1">
                            Promedio: {Math.round(cleanedData.summary.totalImpressions / (cleanedData.summary.totalPosts || 1))}
                          </p>
                        </div>
                        <BarChart3 className="w-10 h-10 text-violet-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Engagement Rate KPI */}
                {cleanedData.summary?.totalLikes && cleanedData.summary?.totalReach && (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-700 font-medium mb-1">Tasa de Engagement</p>
                          <p className="text-3xl font-bold text-yellow-900">
                            {((((cleanedData.summary.totalLikes || 0) + (cleanedData.summary.totalComments || 0) + (cleanedData.summary.totalShares || 0)) / (cleanedData.summary.totalReach || 1)) * 100).toFixed(2)}%
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">Interacciones/Alcance</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Virality Score */}
                {cleanedData.summary?.totalShares && cleanedData.summary?.totalReach && (
                  <Card className="bg-gradient-to-br from-fuchsia-50 to-pink-100 border-fuchsia-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-fuchsia-700 font-medium mb-1">Índice de Viralidad</p>
                          <p className="text-3xl font-bold text-fuchsia-900">
                            {(((cleanedData.summary.totalShares || 0) / (cleanedData.summary.totalReach || 1)) * 100).toFixed(2)}%
                          </p>
                          <p className="text-xs text-fuchsia-600 mt-1">Compartidos/Alcance</p>
                        </div>
                        <Share2 className="w-10 h-10 text-fuchsia-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Average Interaction per Post */}
                {cleanedData.summary?.totalLikes && (
                  <Card className="bg-gradient-to-br from-rose-50 to-red-100 border-rose-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-rose-700 font-medium mb-1">Interacciones por Post</p>
                          <p className="text-3xl font-bold text-rose-900">
                            {Math.round(((cleanedData.summary.totalLikes || 0) + (cleanedData.summary.totalComments || 0) + (cleanedData.summary.totalShares || 0)) / (cleanedData.summary.totalPosts || 1))}
                          </p>
                          <p className="text-xs text-rose-600 mt-1">Promedio total</p>
                        </div>
                        <Heart className="w-10 h-10 text-rose-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {cleanedData.analysis && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Análisis de IA completado</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    Tus datos han sido limpiados y analizados. Revisa las pestañas para ver insights detallados.
                  </AlertDescription>
                </Alert>
              )}

              {/* Data Quality Metrics */}
              {cleanedData.summary?.dataQuality && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Calidad de Datos
                    </CardTitle>
                    <CardDescription>Resumen del proceso de limpieza automática</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 mb-1">Filas Originales</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {cleanedData.summary.dataQuality.totalRowsOriginal || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600 mb-1">Filas Limpias</p>
                        <p className="text-2xl font-bold text-green-900">
                          {cleanedData.summary.dataQuality.cleanRows}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 mb-1">Filas Eliminadas</p>
                        <p className="text-2xl font-bold text-red-900">
                          {cleanedData.summary.dataQuality.rowsWithNullsRemoved || 0}
                        </p>
                        <p className="text-xs text-red-600 mt-1">Con valores vacíos</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 mb-1">Duplicados Eliminados</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {cleanedData.summary.dataQuality.duplicatesRemoved || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <DataAnalysis data={cleanedData} />
            </TabsContent>

            <TabsContent value="data">
              <DataPreview data={cleanedData} />
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Recomendaciones de IA
                  </CardTitle>
                  <CardDescription>Insights generados automáticamente a partir de tus datos</CardDescription>
                </CardHeader>
                <CardContent>
                  {cleanedData.recommendations ? (
                    <div className="space-y-4">
                      {cleanedData.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <h4 className="font-medium text-slate-900 mb-2">{rec.title}</h4>
                          <p className="text-sm text-slate-600">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">Generando recomendaciones...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Chatbot - Always visible */}
        <SocialMediaChatbot userData={cleanedData} />
      </div>
    </div>
  )
}
