"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PowerBIDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function PowerBIDashboard({ isOpen, onClose }: PowerBIDashboardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Dashboard de Productos
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6">
          <iframe
            title="Practica_Dashboard_Productos"
            width="100%"
            height="100%"
            src="https://app.powerbi.com/reportEmbed?reportId=9ea8a96f-302c-40b5-b821-60e43bedb0ef&autoAuth=true&ctid=2bac32fd-d9a2-40d9-a272-3a35920f5607"
            frameBorder="0"
            allowFullScreen={true}
            className="rounded-lg shadow-xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
