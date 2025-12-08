"use client"

import { ArrowLeft, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PowerBIDashboardPage() {
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Dashboard de Productos
                </h1>
                <p className="text-xs text-slate-500">Power BI Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard iframe - Ocupa todo el espacio restante */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          title="Practica_Dashboard_Productos"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/reportEmbed?reportId=9ea8a96f-302c-40b5-b821-60e43bedb0ef&autoAuth=true&ctid=2bac32fd-d9a2-40d9-a272-3a35920f5607"
          frameBorder="0"
          allowFullScreen={true}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
