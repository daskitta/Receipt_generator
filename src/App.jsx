import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TicketForm from './components/TicketForm.jsx'
import TicketPreview from './components/TicketPreview.jsx'
import { generateTicketNumber } from './utils/generateTicketNumber.js'

const today = new Date().toISOString().slice(0, 10)

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
  const ticketRef = useRef(null)

  function regenerate() {
    setData((prev) => ({
      ...prev,
      ticketNumber: generateTicketNumber(prev.companyName || 'RC')
    }))
  }

  async function exportPdf() {
    if (!ticketRef.current) return
    setBusy(true)
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true
      })
      const imgData = canvas.toDataURL('image/png')
      const widthMm = 100
      const heightMm = (canvas.height * widthMm) / canvas.width
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm)
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
        <div className="preview-stage">
          <TicketPreview data={data} ref={ticketRef} />
        </div>
      </div>
    </div>
  )
}
