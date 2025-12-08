"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SampleDataDownload() {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "/sample-data.csv"
    link.download = "datos-ejemplo.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
      <Download className="w-4 h-4" />
      Descargar datos de ejemplo
    </Button>
  )
}
