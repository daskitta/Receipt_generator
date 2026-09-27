import React, { forwardRef } from 'react'

/* Format date string */
function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/* Format time string */
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
  const currency = (d.currency || 'NPR').toUpperCase()

  return (
    <div className="ticket" ref={ref}>
      {/* Top logo header */}
      <div className="ticket-header">
        <div className="ticket-brand">
          <img
            src={d.companyLogo || '/logo.jpg'}
            alt="inDrive"
            className="ticket-logo"
          />
        </div>
        <h1 className="ticket-title">Passenger Ticket</h1>
      </div>

      {/* Meta header row */}
      <div className="ticket-row-split ticket-top-meta">
        <div>
          <span className="ticket-label">Ticket number: </span>
          <span className="ticket-value">{d.ticketNumber || '—'}</span>
        </div>
        <div>
          <span className="ticket-label">Ticket date: </span>
          <span className="ticket-value">{rideDateLabel}</span>
        </div>
      </div>

      {/* Issuer and driver info */}
      <div className="ticket-section-block">
        <div className="ticket-line">
          <span className="ticket-label">Issued by: </span>
          <span className="ticket-value">{d.issuedBy || '—'}</span>
        </div>
        <div className="ticket-line">
          <span className="ticket-label">On behalf of the driver (transport service provider): </span>
          <span className="ticket-value">{d.driverName || '—'}</span>
        </div>
        <div className="ticket-line">
          <span className="ticket-label">Car details: </span>
          <span className="ticket-value">{d.vehicleDetails || '—'}</span>
        </div>
        <div className="ticket-line">
          <span className="ticket-label">Passenger's name: </span>
          <span className="ticket-value">{d.passengerName || '—'}</span>
        </div>
      </div>

      {/* Ride details */}
      <div className="ticket-section-block ticket-trip-details">
        <div className="ticket-field-group">
          <div className="ticket-label">Ride Date:</div>
          <div className="ticket-value">{rideDateLabel}</div>
        </div>

        <div className="ticket-field-group">
          <div className="ticket-label">Pick-up:</div>
          <div className="ticket-value">{d.pickupPlace || '—'}</div>
          <div className="ticket-value">{formatTime(d.pickupTime)}, {rideDateLabel}</div>
        </div>

        <div className="ticket-field-group">
          <div className="ticket-label">Drop-off:</div>
          <div className="ticket-value">{d.dropoffPlace || '—'}</div>
          <div className="ticket-value">{formatTime(d.dropoffTime)}, {rideDateLabel}</div>
        </div>

        <div className="ticket-field-group">
          <div className="ticket-label">Distance:</div>
          <div className="ticket-value">{d.distance ? `${d.distance} km` : '—'}</div>
        </div>
      </div>

      {/* Table section */}
      <div className="ticket-table">
        <div className="ticket-table-row ticket-table-head">
          <span className="ticket-col-desc">Description</span>
          <span className="ticket-col-amount">Amount</span>
        </div>
        <div className="ticket-table-row ticket-table-body">
          <span className="ticket-col-desc ticket-bold">Ride fare (incl. tax)</span>
          <span className="ticket-col-amount">{currency} {amount}</span>
        </div>
      </div>

      {/* Footer info */}
      <div className="ticket-row-split ticket-footer">
        <div>
          <span className="ticket-label">Payment method: </span>
          <span className="ticket-value">{d.paymentMethod || 'Cash'}</span>
        </div>
        <div>
          <span className="ticket-label">Total Amount: </span>
          <span className="ticket-value">{currency} {amount}</span>
        </div>
      </div>
    </div>
  )
})

export default TicketPreview