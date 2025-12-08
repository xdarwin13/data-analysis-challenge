"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DataPreviewProps {
  data: any
}

export default function DataPreview({ data }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const downloadCSV = () => {
    if (!data || !data.cleanedData || data.cleanedData.length === 0) return

    const headers = Object.keys(data.cleanedData[0])
    const csvContent = [
      headers.join(","),
      ...data.cleanedData.map((row: any) =>
        headers.map((header) => {
          const cell = row[header]
          
          // Handle different types properly
          if (cell === null || cell === undefined) {
            return ""
          }
          
          // Handle numbers (including 0)
          if (typeof cell === 'number') {
            return cell.toString()
          }
          
          // Handle strings that might contain commas
          if (typeof cell === 'string') {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
              return `"${cell.replace(/"/g, '""')}"`
            }
            return cell
          }
          
          // Handle booleans and other types
          return String(cell)
        }).join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `datos_limpios_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadJSON = () => {
    if (!data || !data.cleanedData || data.cleanedData.length === 0) return

    const jsonContent = JSON.stringify(data.cleanedData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `datos_limpios_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!data || !data.cleanedData || data.cleanedData.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-slate-600">No hay datos para mostrar</p>
        </CardContent>
      </Card>
    )
  }

  // Pagination calculations
  const totalRows = data.cleanedData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const displayData = data.cleanedData.slice(startIndex, endIndex)
  const columns = Object.keys(displayData[0])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page
  }

  // Calculate data quality metrics
  const calculateDataQuality = () => {
    let nullCount = 0
    let zeroCount = 0
    let totalCells = 0

    data.cleanedData.forEach((row: any) => {
      Object.values(row).forEach((value: any) => {
        totalCells++
        if (value === null || value === undefined || value === "") {
          nullCount++
        } else if (value === 0) {
          zeroCount++
        }
      })
    })

    return {
      nullCount,
      zeroCount,
      totalCells,
      nullPercentage: ((nullCount / totalCells) * 100).toFixed(1),
      zeroPercentage: ((zeroCount / totalCells) * 100).toFixed(1),
    }
  }

  const dataQuality = calculateDataQuality()

  return (
    <>
      {/* Data Quality Alert */}
      {dataQuality.zeroCount > 0 && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Información de Datos</AlertTitle>
          <AlertDescription className="space-y-1">
            <div className="flex gap-4 text-sm">
              <span className="text-slate-600">
                <span className="font-semibold text-amber-600">{dataQuality.zeroCount}</span> valores en cero detectados ({dataQuality.zeroPercentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Los ceros están resaltados en <span className="text-amber-600 font-medium">ámbar</span> e indican publicaciones sin interacción (dato válido). Las filas con valores vacíos fueron eliminadas durante la limpieza.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Datos Limpios</CardTitle>
            <CardDescription>
              Mostrando {startIndex + 1}-{endIndex} de {totalRows} filas procesadas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadJSON} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              JSON
            </Button>
            <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 font-semibold">#</TableHead>
                {columns.map((col) => (
                  <TableHead key={col} className="font-semibold">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row: any, index: number) => (
                <TableRow key={startIndex + index}>
                  <TableCell className="font-medium text-slate-500">
                    {startIndex + index + 1}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {typeof row[col] === "boolean" ? (
                        <Badge variant={row[col] ? "default" : "outline"}>{row[col] ? "Sí" : "No"}</Badge>
                      ) : typeof row[col] === "number" ? (
                        row[col] === 0 ? (
                          <span className="text-amber-600 font-medium text-sm">0</span>
                        ) : (
                          <span className="text-sm">{row[col].toLocaleString()}</span>
                        )
                      ) : (
                        <span className="text-sm">{row[col]?.toString() || "-"}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Filas por página:</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
