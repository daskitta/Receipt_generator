import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TicketForm from './components/TicketForm.jsx'
import TicketPreview from './components/TicketPreview.jsx'
import { generateTicketNumber } from './utils/generateTicketNumber.js'

const today = new Date().toISOString().slice(0, 10)
const EXPORT_WIDTH_PX = 794
const EXPORT_HEIGHT_PX = 1123

const initialData = {
  companyName: 'inDrive',
  companyLogo: '/logo.jpg',
  issuedBy: 'I.N.D. Mobile Pvt. Ltd',
  driverName: 'Pemba Dhwajra Tamang',
  vehicleDetails: 'black MOTOR-BIKE Bajaj BA32PA7999',
  passengerName: 'Aashutosh Dhungel',
  rideDate: '2026-09-23',
  pickupPlace: 'Madan Bhandari Road, Kathmandu, Province No. 3, Nepal',
  pickupTime: '16:04',
  dropoffPlace: 'Venus Public School, Kathmandu, Province No. 3, Nepal',
  dropoffTime: '16:35',
  distance: '8.9',
  currency: 'NPR',
  fareAmount: '181.00',
  paymentMethod: 'Cash',
  ticketNumber: 'NP26092310402GI'
}

export default function App() {
  const [data, setData] = useState(initialData)
  const [busy, setBusy] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const ticketRef = useRef(null)
  const exportTicketRef = useRef(null)
  const previewStageRef = useRef(null)

  useEffect(() => {
    const stage = previewStageRef.current
    if (!stage) return undefined

    function updatePreviewScale() {
      const availableWidth = stage.clientWidth - 24
      const nextScale = Math.min(1, availableWidth / EXPORT_WIDTH_PX)
      setPreviewScale(nextScale > 0 ? nextScale : 1)
    }

    updatePreviewScale()

    const observer = new ResizeObserver(updatePreviewScale)
    observer.observe(stage)

    return () => observer.disconnect()
  }, [])

  function regenerate() {
    setData((prev) => ({
      ...prev,
      ticketNumber: generateTicketNumber(prev.companyName || 'RC')
    }))
  }

  async function exportPdf() {
    if (!exportTicketRef.current) return
    setBusy(true)
    try {
      const canvas = await html2canvas(exportTicketRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        width: exportTicketRef.current.scrollWidth,
        height: exportTicketRef.current.scrollHeight
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
      const name = `ticket-${data.ticketNumber}.pdf`
      pdf.save(name)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <TicketForm data={data} onChange={setData} onRegenerate={regenerate} />

      <div className="preview-panel">
        <div className="preview-toolbar">
          <span>Live preview</span>
          <button type="button" className="btn-primary" onClick={exportPdf} disabled={busy}>
            {busy ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
        <div className="preview-stage" ref={previewStageRef}>
          <div
            className="preview-paper"
            style={{
              width: `${EXPORT_WIDTH_PX}px`,
              height: `${EXPORT_HEIGHT_PX * previewScale}px`
            }}
          >
            <div
              className="preview-paper-scale"
              style={{ transform: `scale(${previewScale})` }}
            >
              <TicketPreview data={data} ref={ticketRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="export-surface" aria-hidden="true">
        <TicketPreview data={data} ref={exportTicketRef} />
      </div>
    </div>
  )
}
