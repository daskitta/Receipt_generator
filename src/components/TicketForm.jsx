import React, { useRef } from 'react'

// input field with label
function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

export default function TicketForm({ data, onChange, onRegenerate }) {
  const fileRef = useRef(null)

  function set(key, value) {
    onChange({ ...data, [key]: value })
  }

  function handleLogo(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('companyLogo', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="form-panel">
      <div className="form-header">
        <span className="form-eyebrow">Details</span>
        <h1>Ride receipt</h1>
        <p className="form-sub">Fill in the trip info and the ticket updates on the right.</p>
      </div>

      <div className="form-section">
        <h2>Company</h2>
        <div className="form-grid">
          <Field label="Company name">
            <input
              type="text"
              placeholder="Your company Ltd."
              value={data.companyName}
              onChange={(e) => set('companyName', e.target.value)}
            />
          </Field>
          <Field label="Logo">
            <div className="logo-picker">
              <button type="button" className="btn-ghost" onClick={() => fileRef.current.click()}>
                {data.companyLogo ? 'Change logo' : 'Upload logo'}
              </button>
              {data.companyLogo && (
                <button type="button" className="btn-text" onClick={() => set('companyLogo', null)}>
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogo}
              />
            </div>
          </Field>
        </div>
      </div>

      <div className="form-section">
        <h2>People and vehicle</h2>
        <div className="form-grid">
          <Field label="Driver name">
            <input
              type="text"
              placeholder="Driver full name"
              value={data.driverName}
              onChange={(e) => set('driverName', e.target.value)}
            />
          </Field>
          <Field label="Passenger name">
            <input
              type="text"
              placeholder="Passenger full name"
              value={data.passengerName}
              onChange={(e) => set('passengerName', e.target.value)}
            />
          </Field>
          <Field label="Vehicle details">
            <input
              type="text"
              placeholder="e.g. white Sedan Toyota Vios AB12CD3456"
              value={data.vehicleDetails}
              onChange={(e) => set('vehicleDetails', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="form-section">
        <h2>Trip</h2>
        <div className="form-grid">
          <Field label="Ride date">
            <input
              type="date"
              value={data.rideDate}
              onChange={(e) => set('rideDate', e.target.value)}
            />
          </Field>
          <Field label="Distance (km)">
            <input
              type="text"
              placeholder="e.g. 8.9"
              value={data.distance}
              onChange={(e) => set('distance', e.target.value)}
            />
          </Field>
          <Field label="Pickup place">
            <input
              type="text"
              placeholder="Pickup address"
              value={data.pickupPlace}
              onChange={(e) => set('pickupPlace', e.target.value)}
            />
          </Field>
          <Field label="Pickup time">
            <input
              type="time"
              value={data.pickupTime}
              onChange={(e) => set('pickupTime', e.target.value)}
            />
          </Field>
          <Field label="Drop off place">
            <input
              type="text"
              placeholder="Drop off address"
              value={data.dropoffPlace}
              onChange={(e) => set('dropoffPlace', e.target.value)}
            />
          </Field>
          <Field label="Drop off time">
            <input
              type="time"
              value={data.dropoffTime}
              onChange={(e) => set('dropoffTime', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="form-section">
        <h2>Payment</h2>
        <div className="form-grid">
          <Field label="Currency">
            <input
              type="text"
              placeholder="e.g. USD"
              value={data.currency}
              onChange={(e) => set('currency', e.target.value)}
            />
          </Field>
          <Field label="Fare amount">
            <input
              type="text"
              placeholder="e.g. 12.50"
              value={data.fareAmount}
              onChange={(e) => set('fareAmount', e.target.value)}
            />
          </Field>
          <Field label="Payment method">
            <select
              value={data.paymentMethod}
              onChange={(e) => set('paymentMethod', e.target.value)}
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Wallet</option>
              <option>Bank transfer</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="form-footer">
        <div className="ticket-no-preview">
          <span>Ticket number</span>
          <strong>{data.ticketNumber}</strong>
        </div>
        <button type="button" className="btn-ghost" onClick={onRegenerate}>
          Regenerate number
        </button>
      </div>
    </div>
  )
}
