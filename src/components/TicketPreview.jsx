import React, { forwardRef } from 'react'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(value) {
  if (!value) return '—'
  const [h, m] = value.split(':')
  const d = new Date()
  d.setHours(Number(h), Number(m))
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const TicketPreview = forwardRef(function TicketPreview(props, ref) {
  const d = props.data
  const rideDateLabel = formatDate(d.rideDate)
  const amount = d.fareAmount ? Number(d.fareAmount).toFixed(2) : '0.00'
  const currency = (d.currency || 'USD').toUpperCase()

  return (
    <div className="ticket" ref={ref}>
      <div className="ticket-brand">
        {d.companyLogo ? (
          <img src={d.companyLogo} alt="logo" className="ticket-logo" />
        ) : (
          <img src="/logo.jpg" alt="logo" className="ticket-logo" />
        )}
        <span className="ticket-brand-name">{d.companyName || 'inDrive'}</span>
      </div>

      <p className="ticket-kind">Passenger Ticket</p>

      <div className="ticket-row ticket-row-split ticket-info-header">
        <div>
          <span className="ticket-label">Ticket number: </span>
          <span>{d.ticketNumber || '—'}</span>
        </div>
        <div>
          <span className="ticket-label">Ticket date: </span>
          <span>{rideDateLabel}</span>
        </div>
      </div>

      <div className="ticket-block">
        <div className="ticket-row">
          <span className="ticket-label">Issued by: </span>
          <span>{d.issuedBy || d.companyName || '—'}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">On behalf of the driver (transport service provider): </span>
          <span>{d.driverName || '—'}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">Car details: </span>
          <span>{d.vehicleDetails || '—'}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">Passenger's name: </span>
          <span>{d.passengerName || '—'}</span>
        </div>
      </div>

      <div className="ticket-block ticket-trip-block">
        <div className="ticket-row">
          <span className="ticket-label">Ride Date:</span>
        </div>
        <div className="ticket-row">{rideDateLabel}</div>

        <div className="ticket-row">
          <span className="ticket-label">Pick-up:</span>
        </div>
        <div className="ticket-row">{d.pickupPlace || '—'}</div>
        <div className="ticket-row">{formatTime(d.pickupTime)}, {rideDateLabel}</div>

        <div className="ticket-row">
          <span className="ticket-label">Drop-off:</span>
        </div>
        <div className="ticket-row">{d.dropoffPlace || '—'}</div>
        <div className="ticket-row">{formatTime(d.dropoffTime)}, {rideDateLabel}</div>

        <div className="ticket-row">
          <span className="ticket-label">Distance:</span>
        </div>
        <div className="ticket-row">{d.distance ? `${d.distance} km` : '—'}</div>
      </div>

      <div className="ticket-table">
        <div className="ticket-table-row ticket-table-head">
          <span>Description</span>
          <span>Amount</span>
        </div>
        <div className="ticket-table-row ticket-table-item">
          <span>Ride fare (incl. tax)</span>
          <span>{currency} {amount}</span>
        </div>
      </div>

      <div className="ticket-row ticket-row-split ticket-total">
        <div>
          <span className="ticket-label">Payment method: </span>
          <span>{d.paymentMethod || 'Cash'}</span>
        </div>
        <div>
          <span className="ticket-label">Total Amount: </span>
          <span>{currency} {amount}</span>
        </div>
      </div>
    </div>
  )
})

export default TicketPreview
