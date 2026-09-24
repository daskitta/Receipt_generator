// generate unique ticket number
// format prefix yymmdd hhmmss rand4
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const pad = n => String(n).padStart(2, '0')

export function generateTicketNumber(prefix = 'NP') {
  const cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'NP'
  const now = new Date()
  
  const y = String(now.getUTCFullYear()).slice(2)
  const datePart = `${y}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}`
  const timePart = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`
  
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += CHARS[Math.floor(Math.random() * CHARS.length)]
  }

  return `${cleanPrefix}${datePart}${timePart}${rand}`
}