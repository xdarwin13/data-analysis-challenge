"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, TrendingUp, Clock, Target, Sparkles, CheckCircle2, Zap, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: "Patrones de éxito",
      description: "Identifica qué tipo de contenido genera más ventas indirectas y engagement en tu audiencia.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Mejor momento",
      description: "Descubre el horario y día óptimo para publicar según el comportamiento de tu audiencia.",
      color: "cyan",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Recomendaciones IA",
      description: "Recibe sugerencias concretas basadas en datos para mejorar tu estrategia digital.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Métricas claras",
      description: "Visualiza tus datos de forma simple y entiende si estás creciendo o estancado.",
      color: "green",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Limpieza automática",
      description: "Nuestra IA procesa y limpia tus datos automáticamente para análisis precisos.",
      color: "orange",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: CheckCircle2,
      title: "Multi-plataforma",
      description: "Analiza datos de Instagram, Facebook y TikTok en un solo lugar.",
      color: "pink",
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <img src="/logo.webp" alt="DataPulse" className="w-13 h-13 object-contain transform group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-bold text-xl text-slate-900">DataPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group">
              Características
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group">
              Beneficios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group">
              Precios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Comenzar gratis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6 hover:bg-blue-100 transition-all duration-300 cursor-default hover:scale-105 border border-blue-100 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Potenciado por Inteligencia Artificial
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
            Optimiza tus redes sociales con{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              datos inteligentes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 text-pretty max-w-2xl mx-auto">
            Descubre qué funciona en Instagram, Facebook y TikTok. Identifica patrones de éxito, encuentra el mejor
            momento para publicar y aumenta tu engagement con IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2 text-base transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl group relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  Analizar mis datos ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base bg-transparent hover:bg-slate-50 border-2 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
              onClick={() => window.open('/powerbi-dashboard', '_blank')}
            >
              <BarChart3 className="w-5 h-5" />
              Ver Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Configuración en 2 minutos
            </div>
          </div>
        </div>

        {/* Hero Image with floating stats */}
        <div className={`mt-16 max-w-5xl mx-auto relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="rounded-2xl border-8 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <img src="/modern-analytics-dashboard-showing-social-media-me.jpg" alt="Dashboard preview" className="w-full h-auto" />
          </div>
          
          {/* Floating stat cards */}
          <div className="absolute -top-6 -left-6 bg-white rounded-xl p-4 shadow-xl hover:scale-110 transition-transform duration-300 cursor-default border border-slate-100 hidden md:block animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Engagement</p>
                <p className="text-lg font-bold text-slate-900">+245%</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl hover:scale-110 transition-transform duration-300 cursor-default border border-slate-100 hidden md:block animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Usuarios activos</p>
                <p className="text-lg font-bold text-slate-900">1,234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
            Todo lo que necesitas para crecer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Herramientas potenciadas por IA para entender tu audiencia y mejorar tu estrategia digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isActive = activeFeature === index
            return (
              <Card 
                key={index}
                className={`border-2 transition-all duration-500 cursor-pointer group hover:shadow-2xl transform hover:-translate-y-2 ${
                  isActive 
                    ? 'border-blue-400 shadow-xl scale-105' 
                    : 'border-transparent hover:border-blue-200'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                    {feature.description}
                  </p>
                  <div className={`mt-4 h-1 bg-gradient-to-r ${feature.gradient} rounded-full transform origin-left transition-all duration-500 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
              Deja de adivinar, empieza a <span className="text-blue-600 relative inline-block">
                decidir con datos
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500"></span>
              </span>
            </h2>
            <div className="space-y-6">
              {[
                { title: "Ahorra tiempo", desc: "No más hojas de cálculo complicadas. Nuestro dashboard te muestra todo de forma visual." },
                { title: "Aumenta ventas", desc: "Identifica qué publicaciones generan más interés y replica el éxito." },
                { title: "Crece más rápido", desc: "Toma decisiones basadas en datos reales, no en intuición." }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="transform group-hover:translate-x-2 transition-transform duration-300">
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 border-4 border-white">
            <img src="/social-media-analytics-charts-and-graphs-interface.jpg" alt="Analytics interface" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Planes simples, <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">transparentes</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comienza gratis y escala cuando lo necesites. Sin sorpresas, sin letra pequeña.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Gratis */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Gratis</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-600">/mes</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Perfecto para empezar</p>
                </div>
                
                <Link href="/dashboard">
                  <Button className="w-full mb-6 bg-slate-900 hover:bg-slate-800 transform group-hover:scale-105 transition-all">
                    Comenzar ahora
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {[
                    "Hasta 100 registros por análisis",
                    "Limpieza automática de datos",
                    "5 gráficos básicos",
                    "Exportar CSV/JSON",
                    "Soporte por email"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Plan Pro - Destacado */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-4 border-blue-600 shadow-xl">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-600 to-cyan-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                MÁS POPULAR
              </div>
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">$0</span>
                    <span className="text-slate-600">/mes</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Para negocios en crecimiento</p>
                </div>
                
                <Link href="/dashboard">
                  <Button className="w-full mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transform group-hover:scale-105 transition-all shadow-lg">
                    Comenzar prueba gratis
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {[
                    "Registros ilimitados",
                    "Todos los gráficos avanzados",
                    "Análisis con IA incluido",
                    "Exportar en todos los formatos",
                    "Recomendaciones personalizadas",
                    "Soporte prioritario 24/7",
                    "Actualizaciones automáticas"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Plan Enterprise */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-600">/mes</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Para equipos grandes</p>
                </div>
                
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full mb-6 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transform group-hover:scale-105 transition-all">
                    Contactar ventas
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {[
                    "Todo de Pro incluido",
                    "Múltiples usuarios y equipos",
                    "API personalizada",
                    "Integraciones dedicadas",
                    "Account manager dedicado",
                    "SLA garantizado",
                    "Capacitación personalizada"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-600 mb-6">Confiado por emprendedores en todo el mundo</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">500+ usuarios activos</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-slate-700">15+ países</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">10k+ análisis realizados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Comienza a optimizar tus redes sociales hoy
            </h2>
            <p className="text-lg text-blue-50 mb-8 text-pretty">
              Únete a cientos de emprendedores que ya están tomando mejores decisiones con datos
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 text-base transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                Probar gratis ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-md">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">DataPulse</span>
            </div>
            <p className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              © 2025 DataPulse. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
