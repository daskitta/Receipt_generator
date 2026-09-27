// generate unique ticket number
// format prefix yymmdd hhmmss rand4
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const pad = n => String(n).padStart(2, '0')

export function generateTicketNumber(prefix = 'NP') {
  const cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'NP'
  const now = new Date()
  
  // Changed UTC methods to Local methods to match local rideDate
  const y = String(now.getFullYear()).slice(2)
  const datePart = `${y}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += CHARS[Math.floor(Math.random() * CHARS.length)]
  }

  return `${cleanPrefix}${datePart}${timePart}${rand}`
}