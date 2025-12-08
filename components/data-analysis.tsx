"use client"

import { Calendar, Clock, Award, TrendingUp, PieChart as PieChartIcon, Share2, Heart, MessageCircle, Eye, BarChart2, Users, Zap, Target, Activity, Flame, TrendingDown, Percent, DollarSign, ArrowUpRight, ArrowDownRight, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, Tooltip, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, ScatterChart, Scatter, ZAxis, Funnel, FunnelChart, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

interface DataAnalysisProps {
  data: any
}

export default function DataAnalysis({ data }: DataAnalysisProps) {
  if (!data || !data.charts) {
    return null
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#14b8a6']

  // Calculate additional metrics
  const calculateMetrics = () => {
    // Use cleanedData if available, otherwise return null
    const posts = data.cleanedData || data.cleanData
    if (!posts || !Array.isArray(posts) || posts.length === 0) return null

    const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.Likes || 0), 0)
    const totalComments = posts.reduce((sum: number, post: any) => sum + (post.Comentarios || 0), 0)
    const totalShares = posts.reduce((sum: number, post: any) => sum + (post.Compartidos || 0), 0)
    const totalReach = posts.reduce((sum: number, post: any) => sum + (post.Alcance || 0), 0)
    const totalImpressions = posts.reduce((sum: number, post: any) => sum + (post.Impresiones || 0), 0)

    // Metrics by platform
    const platformMetrics = posts.reduce((acc: any, post: any) => {
      const platform = post.Plataforma || 'Unknown'
      if (!acc[platform]) {
        acc[platform] = { platform, likes: 0, comments: 0, shares: 0, reach: 0, impressions: 0, posts: 0 }
      }
      acc[platform].likes += post.Likes || 0
      acc[platform].comments += post.Comentarios || 0
      acc[platform].shares += post.Compartidos || 0
      acc[platform].reach += post.Alcance || 0
      acc[platform].impressions += post.Impresiones || 0
      acc[platform].posts += 1
      return acc
    }, {})

    // Metrics by content type
    const typeMetrics = posts.reduce((acc: any, post: any) => {
      const type = post.Tipo || 'Unknown'
      if (!acc[type]) {
        acc[type] = { type, likes: 0, comments: 0, shares: 0, posts: 0, reach: 0, impressions: 0 }
      }
      acc[type].likes += post.Likes || 0
      acc[type].comments += post.Comentarios || 0
      acc[type].shares += post.Compartidos || 0
      acc[type].reach += post.Alcance || 0
      acc[type].impressions += post.Impresiones || 0
      acc[type].posts += 1
      return acc
    }, {})

    // Hourly distribution
    const hourlyData = posts.reduce((acc: any, post: any) => {
      const hour = post.Hora ? parseInt(post.Hora.split(':')[0]) : 0
      if (!acc[hour]) {
        acc[hour] = { hour: `${hour}:00`, count: 0, engagement: 0 }
      }
      acc[hour].count += 1
      acc[hour].engagement += (post.Likes || 0) + (post.Comentarios || 0) + (post.Compartidos || 0)
      return acc
    }, {})

    // Daily distribution
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const dailyData = posts.reduce((acc: any, post: any) => {
      if (post.Fecha) {
        const date = new Date(post.Fecha)
        const dayName = daysOfWeek[date.getDay()]
        if (!acc[dayName]) {
          acc[dayName] = { day: dayName, count: 0, engagement: 0, reach: 0 }
        }
        acc[dayName].count += 1
        acc[dayName].engagement += (post.Likes || 0) + (post.Comentarios || 0) + (post.Compartidos || 0)
        acc[dayName].reach += post.Alcance || 0
      }
      return acc
    }, {})

    // Time series data
    const timeSeriesData = posts.map((post: any) => ({
      date: post.Fecha,
      likes: post.Likes || 0,
      comments: post.Comentarios || 0,
      shares: post.Compartidos || 0,
      reach: post.Alcance || 0,
      impressions: post.Impresiones || 0,
      engagement: (post.Likes || 0) + (post.Comentarios || 0) + (post.Compartidos || 0)
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Correlation data (Reach vs Engagement)
    const correlationData = posts.map((post: any) => ({
      reach: post.Alcance || 0,
      engagement: (post.Likes || 0) + (post.Comentarios || 0) + (post.Compartidos || 0),
      impressions: post.Impresiones || 0,
      platform: post.Plataforma || 'Unknown'
    }))

    return {
      platformMetrics: Object.values(platformMetrics),
      typeMetrics: Object.values(typeMetrics),
      hourlyData: Object.values(hourlyData),
      dailyData: Object.values(dailyData),
      timeSeriesData,
      correlationData,
      totalLikes,
      totalComments,
      totalShares,
      totalReach,
      totalImpressions
    }
  }

  const metrics = calculateMetrics()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Engagement by Day */}
      {data.charts.byDay && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Engagement por Día de la Semana
            </CardTitle>
            <CardDescription>Identifica qué días tu audiencia está más activa</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.byDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Engagement by Hour */}
      {data.charts.byHour && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Engagement por Hora del Día
            </CardTitle>
            <CardDescription>Descubre las mejores horas para publicar</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.byHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="engagement" stroke="var(--color-engagement)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Engagement by Content Type */}
      {data.charts.byContentType && data.charts.byContentType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Engagement por Tipo de Contenido
            </CardTitle>
            <CardDescription>Qué tipo de contenido genera más interacción</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Engagement",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.charts.byContentType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.charts.byContentType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Engagement Trend */}
      {data.charts.trendOverTime && data.charts.trendOverTime.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencia de Engagement
            </CardTitle>
            <CardDescription>Evolución del engagement en el tiempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.charts.trendOverTime}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-engagement)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-engagement)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    fillOpacity={1} 
                    fill="url(#colorEngagement)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Platform Comparison */}
      {data.charts.byPlatform && data.charts.byPlatform.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Comparativa por Plataforma
            </CardTitle>
            <CardDescription>Rendimiento en diferentes redes sociales</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-4))",
                },
                reach: {
                  label: "Alcance",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" name="Engagement" />
                  <Bar dataKey="reach" fill="var(--color-reach)" name="Alcance" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Posts */}
      {data.topPosts && data.topPosts.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Mejores Publicaciones
            </CardTitle>
            <CardDescription>Tus publicaciones con mejor rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPosts.slice(0, 5).map((post: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {post.type || "Publicación"} - {post.date}
                    </p>
                    <div className="flex gap-4 text-xs text-slate-600">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                      <span>📊 {post.engagement}% engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Rate by Platform */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Tasa de Engagement por Plataforma
            </CardTitle>
            <CardDescription>Rendimiento de engagement comparado</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Tasa de Engagement",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.platformMetrics.map((p: any) => ({
                  platform: p.platform,
                  rate: ((p.likes + p.comments + p.shares) / p.reach * 100).toFixed(2)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" fill="var(--color-rate)" name="Engagement %" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Likes vs Comments vs Shares */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Distribución de Interacciones
            </CardTitle>
            <CardDescription>Comparativa de tipos de interacción</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                likes: {
                  label: "Likes",
                  color: "hsl(var(--chart-1))",
                },
                comments: {
                  label: "Comentarios",
                  color: "hsl(var(--chart-2))",
                },
                shares: {
                  label: "Compartidos",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.platformMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="likes" fill="var(--color-likes)" name="Likes" />
                  <Bar dataKey="comments" fill="var(--color-comments)" name="Comentarios" />
                  <Bar dataKey="shares" fill="var(--color-shares)" name="Compartidos" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Reach vs Impressions */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Alcance vs Impresiones por Plataforma
            </CardTitle>
            <CardDescription>Comparativa de visibilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                reach: {
                  label: "Alcance",
                  color: "hsl(var(--chart-4))",
                },
                impressions: {
                  label: "Impresiones",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={metrics.platformMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="reach" fill="var(--color-reach)" name="Alcance" />
                  <Line type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} name="Impresiones" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Radar Chart */}
      {metrics && metrics.typeMetrics && metrics.typeMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Rendimiento por Tipo de Contenido
            </CardTitle>
            <CardDescription>Análisis multidimensional</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Métricas",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={metrics.typeMetrics.map((t: any) => ({
                  type: t.type,
                  Likes: t.likes / t.posts,
                  Comentarios: t.comments / t.posts,
                  Compartidos: t.shares / t.posts,
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="type" />
                  <PolarRadiusAxis />
                  <Radar name="Likes" dataKey="Likes" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Comentarios" dataKey="Comentarios" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Radar name="Compartidos" dataKey="Compartidos" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Content Type Distribution */}
      {metrics && metrics.typeMetrics && metrics.typeMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Distribución por Tipo de Contenido
            </CardTitle>
            <CardDescription>Volumen de publicaciones por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Publicaciones",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.typeMetrics.map((t: any) => ({
                      name: t.type,
                      value: t.posts
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {metrics.typeMetrics.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Average Engagement by Content Type */}
      {metrics && metrics.typeMetrics && metrics.typeMetrics.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Engagement Promedio por Tipo de Contenido
            </CardTitle>
            <CardDescription>Qué tipo de contenido genera más interacción</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgEngagement: {
                  label: "Engagement Promedio",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.typeMetrics.map((t: any) => ({
                  type: t.type,
                  avgEngagement: ((t.likes + t.comments + t.shares) / t.posts).toFixed(0)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgEngagement" fill="var(--color-avgEngagement)" name="Engagement Promedio" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Posts per Platform */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Publicaciones por Plataforma
            </CardTitle>
            <CardDescription>Distribución de tu contenido</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                posts: {
                  label: "Publicaciones",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.platformMetrics.map((p: any) => ({
                      name: p.platform,
                      value: p.posts
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {metrics.platformMetrics.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Engagement Summary Stats */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Resumen de Interacciones
            </CardTitle>
            <CardDescription>Desglose total de engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Total Likes</span>
                </div>
                <span className="text-xl font-bold text-red-900">{metrics.totalLikes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Comentarios</span>
                </div>
                <span className="text-xl font-bold text-blue-900">{metrics.totalComments.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Total Compartidos</span>
                </div>
                <span className="text-xl font-bold text-green-900">{metrics.totalShares.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Total Alcance</span>
                </div>
                <span className="text-xl font-bold text-orange-900">{metrics.totalReach.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Total Impresiones</span>
                </div>
                <span className="text-xl font-bold text-purple-900">{metrics.totalImpressions.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Heatmap */}
      {metrics && metrics.hourlyData && metrics.hourlyData.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Actividad por Hora del Día
            </CardTitle>
            <CardDescription>Distribución de publicaciones y engagement por hora</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Publicaciones",
                  color: "hsl(var(--chart-1))",
                },
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={metrics.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" name="Publicaciones" />
                  <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="var(--color-engagement)" strokeWidth={2} name="Engagement" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Daily Activity Heatmap */}
      {metrics && metrics.dailyData && metrics.dailyData.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Rendimiento por Día de la Semana
            </CardTitle>
            <CardDescription>Publicaciones, engagement y alcance por día</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Publicaciones",
                  color: "hsl(var(--chart-1))",
                },
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
                reach: {
                  label: "Alcance",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={metrics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--color-count)" name="Publicaciones" />
                  <Line type="monotone" dataKey="engagement" stroke="var(--color-engagement)" strokeWidth={2} name="Engagement" />
                  <Line type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} name="Alcance" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Time Series - Multiple Metrics */}
      {metrics && metrics.timeSeriesData && metrics.timeSeriesData.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolución Temporal de Métricas
            </CardTitle>
            <CardDescription>Tendencia de todas las métricas en el tiempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                likes: {
                  label: "Likes",
                  color: "hsl(var(--chart-1))",
                },
                comments: {
                  label: "Comentarios",
                  color: "hsl(var(--chart-2))",
                },
                shares: {
                  label: "Compartidos",
                  color: "hsl(var(--chart-3))",
                },
                reach: {
                  label: "Alcance",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} name="Comentarios" />
                  <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" strokeWidth={2} name="Compartidos" />
                  <Line type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} name="Alcance" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Correlation Analysis - Reach vs Engagement */}
      {metrics && metrics.correlationData && metrics.correlationData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Correlación: Alcance vs Engagement
            </CardTitle>
            <CardDescription>Relación entre alcance y engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Engagement",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="reach" name="Alcance" />
                  <YAxis type="number" dataKey="engagement" name="Engagement" />
                  <ZAxis range={[50, 400]} />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Posts" data={metrics.correlationData} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Impressions vs Reach Analysis */}
      {metrics && metrics.correlationData && metrics.correlationData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Alcance vs Impresiones
            </CardTitle>
            <CardDescription>Eficiencia de alcance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Impresiones",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="reach" name="Alcance" />
                  <YAxis type="number" dataKey="impressions" name="Impresiones" />
                  <ZAxis range={[50, 400]} />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Posts" data={metrics.correlationData} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Comparison Table */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Tabla Comparativa de Rendimiento
            </CardTitle>
            <CardDescription>Métricas detalladas por plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Plataforma</th>
                    <th className="text-right p-3 font-medium">Posts</th>
                    <th className="text-right p-3 font-medium">Likes</th>
                    <th className="text-right p-3 font-medium">Comentarios</th>
                    <th className="text-right p-3 font-medium">Compartidos</th>
                    <th className="text-right p-3 font-medium">Alcance</th>
                    <th className="text-right p-3 font-medium">Impresiones</th>
                    <th className="text-right p-3 font-medium">Eng. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.platformMetrics.map((platform: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium">{platform.platform}</td>
                      <td className="text-right p-3">{platform.posts}</td>
                      <td className="text-right p-3">{platform.likes.toLocaleString()}</td>
                      <td className="text-right p-3">{platform.comments.toLocaleString()}</td>
                      <td className="text-right p-3">{platform.shares.toLocaleString()}</td>
                      <td className="text-right p-3">{platform.reach.toLocaleString()}</td>
                      <td className="text-right p-3">{platform.impressions.toLocaleString()}</td>
                      <td className="text-right p-3">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {((platform.likes + platform.comments + platform.shares) / platform.reach * 100).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Type Performance Metrics */}
      {metrics && metrics.typeMetrics && metrics.typeMetrics.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Métricas Detalladas por Tipo de Contenido
            </CardTitle>
            <CardDescription>Análisis completo de rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {metrics.typeMetrics.map((type: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">{type.type}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {type.posts} publicaciones
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Likes Promedio</p>
                      <p className="text-xl font-bold text-red-600">{Math.round(type.likes / type.posts)}</p>
                      <Progress value={(type.likes / metrics.totalLikes) * 100} className="mt-2 h-1" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Comentarios Promedio</p>
                      <p className="text-xl font-bold text-blue-600">{Math.round(type.comments / type.posts)}</p>
                      <Progress value={(type.comments / metrics.totalComments) * 100} className="mt-2 h-1" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Compartidos Promedio</p>
                      <p className="text-xl font-bold text-green-600">{Math.round(type.shares / type.posts)}</p>
                      <Progress value={(type.shares / metrics.totalShares) * 100} className="mt-2 h-1" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Engagement Rate</p>
                      <p className="text-xl font-bold text-purple-600">
                        {((type.likes + type.comments + type.shares) / type.reach * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Funnel */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Embudo de Engagement
            </CardTitle>
            <CardDescription>De impresiones a compartidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Impresiones</span>
                  <span className="text-sm font-bold">{metrics.totalImpressions.toLocaleString()}</span>
                </div>
                <Progress value={100} className="h-3" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Alcance</span>
                  <span className="text-sm font-bold">
                    {metrics.totalReach.toLocaleString()} 
                    <span className="text-xs text-slate-500 ml-2">
                      ({((metrics.totalReach / metrics.totalImpressions) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <Progress value={(metrics.totalReach / metrics.totalImpressions) * 100} className="h-3" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Likes</span>
                  <span className="text-sm font-bold">
                    {metrics.totalLikes.toLocaleString()}
                    <span className="text-xs text-slate-500 ml-2">
                      ({((metrics.totalLikes / metrics.totalReach) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <Progress value={(metrics.totalLikes / metrics.totalReach) * 100} className="h-3" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Comentarios</span>
                  <span className="text-sm font-bold">
                    {metrics.totalComments.toLocaleString()}
                    <span className="text-xs text-slate-500 ml-2">
                      ({((metrics.totalComments / metrics.totalReach) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <Progress value={(metrics.totalComments / metrics.totalReach) * 100} className="h-3" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Compartidos</span>
                  <span className="text-sm font-bold">
                    {metrics.totalShares.toLocaleString()}
                    <span className="text-xs text-slate-500 ml-2">
                      ({((metrics.totalShares / metrics.totalReach) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <Progress value={(metrics.totalShares / metrics.totalReach) * 100} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Performance Scores */}
      {metrics && metrics.platformMetrics && metrics.platformMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Puntuación de Rendimiento
            </CardTitle>
            <CardDescription>Score basado en métricas clave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.platformMetrics.map((platform: any, index: number) => {
                const score = Math.min(100, Math.round(
                  (platform.likes / 100) + 
                  (platform.comments * 2 / 10) + 
                  (platform.shares * 3 / 10) + 
                  ((platform.likes + platform.comments + platform.shares) / platform.reach * 50)
                ))
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{platform.platform}</span>
                      <span className="text-2xl font-bold text-blue-600">{score}</span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <p className="text-xs text-slate-600 mt-1">
                      {score >= 80 ? '🔥 Excelente' : score >= 60 ? '✨ Muy bueno' : score >= 40 ? '👍 Bueno' : '📈 Mejorable'}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
