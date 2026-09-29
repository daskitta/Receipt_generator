import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TicketForm from './components/TicketForm.jsx'
import TicketPreview from './components/TicketPreview.jsx'
import { generateTicketNumber } from './utils/generateTicketNumber.js'

const EXPORT_WIDTH_PX = 794
const EXPORT_HEIGHT_PX = 1123
const STORAGE_KEY = 'ride-receipt-generator:data-v1'

const getTodayLocalDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initialData = {
  companyLogo: '/logo.jpg',
  issuedBy: 'I.N.D. Mobile Pvt. Ltd',
  driverName: 'Pemba Dhwajra Tamang',
  vehicleDetails: 'black MOTOR-BIKE Bajaj BA32PA7999',
  passengerName: 'Aashutosh Dhungel',
  rideDate: getTodayLocalDate(),
  pickupPlace: 'Madan Bhandari Road, Kathmandu, Province No. 3, Nepal',
  pickupTime: '16:04',
  dropoffPlace: 'Venus Public School, Kathmandu, Province No. 3, Nepal',
  dropoffTime: '16:35',
  distance: '8.9',
  currency: 'NPR',
  fareAmount: '181.00',
  paymentMethod: 'Cash',
  ticketNumber: generateTicketNumber()
}

function getStoredData() {
  if (typeof window === 'undefined') return null

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!storedValue) return null

    const parsed = JSON.parse(storedValue)
    return parsed && typeof parsed === 'object' ? { ...initialData, ...parsed } : null
  } catch (error) {
    console.warn('Unable to read saved receipt data', error)
    return null
  }
}

export default function App() {
  const [data, setData] = useState(() => getStoredData() || initialData)
  const [busy, setBusy] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const exportTicketRef = useRef(null)
  const previewStageRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(data)
      if (serialized.length < 4_500_000) {
        window.localStorage.setItem(STORAGE_KEY, serialized)
      } else {
        console.warn('Saved receipt data was too large to store locally')
      }
    } catch (error) {
      console.warn('Unable to save receipt data', error)
    }
  }, [data])

  useEffect(() => {
    const stage = previewStageRef.current
    if (!stage) return undefined

    function updatePreviewScale() {
      const availableWidth = stage.clientWidth - 32
      const nextScale = availableWidth / EXPORT_WIDTH_PX
      setPreviewScale(nextScale < 1 ? nextScale : 1)
    }

    updatePreviewScale()

    const observer = new ResizeObserver(updatePreviewScale)
    observer.observe(stage)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined

    navigator.serviceWorker
      .register('/sw.js')
      .catch((error) => console.error('Service worker registration failed', error))

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  function regenerate() {
    setData((prev) => ({
      ...prev,
      ticketNumber: generateTicketNumber()
    }))
  }

  function clearSavedData() {
    if (typeof window === 'undefined') return

    window.localStorage.removeItem(STORAGE_KEY)
    setData({
      ...initialData,
      ticketNumber: generateTicketNumber()
    })
  }

  async function handleInstall() {
    if (!installPrompt) return

    installPrompt.prompt()
    const choice = await installPrompt.userChoice

    if (choice.outcome === 'accepted') {
      setIsInstallable(false)
    }

    setInstallPrompt(null)
  }

  async function exportPdf() {
    if (!exportTicketRef.current || busy) return
    setBusy(true)

    try {
      const canvas = await html2canvas(exportTicketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: EXPORT_WIDTH_PX,
        height: EXPORT_HEIGHT_PX,
        windowWidth: EXPORT_WIDTH_PX,
        windowHeight: EXPORT_HEIGHT_PX,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
      pdf.save(`ticket-${data.ticketNumber}.pdf`)
    } catch (err) {
      console.error('PDF export failed', err)
      alert('Failed to generate PDF')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="form-column">
        <TicketForm
          data={data}
          onChange={setData}
          onRegenerate={regenerate}
          onClearSavedData={clearSavedData}
        />
        <div className="developer-credit">
          <a href="https://www.prasant-bhattarai.com.np/" target="_blank" rel="noreferrer">
            Developed by Prasant Bhattarai
          </a>
        </div>
      </div>

      <div className="preview-panel">
        <div className="preview-toolbar">
          <div className="toolbar-status">
            <span>Live preview</span>
            <span className="status-badge">Offline ready</span>
          </div>
          <div className="toolbar-actions">
            {isInstallable && (
              <button type="button" className="btn-secondary" onClick={handleInstall}>
                Install app
              </button>
            )}
            <button type="button" className="btn-primary" onClick={exportPdf} disabled={busy}>
              {busy ? 'Preparing' : 'Download PDF'}
            </button>
          </div>
        </div>
        <div className="preview-stage" ref={previewStageRef}>
          <div
            className="preview-paper-wrapper"
            style={{
              width: `${EXPORT_WIDTH_PX * previewScale}px`,
              height: `${EXPORT_HEIGHT_PX * previewScale}px`
            }}
          >
            <div
              className="preview-paper-scale"
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left'
              }}
            >
              <TicketPreview data={data} />
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