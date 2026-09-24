// creates a unique ticket number
// format PREFIX + YYMMDD + HHMMSS + 4 random chars
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function pad(n) {
  return String(n).padStart(2, '0')
}

export function generateTicketNumber(prefix) {
  const clean = (prefix || 'RC').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'RC'
  const now = new Date()
  const y = String(now.getFullYear()).slice(2)
  const datePart = `${y}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return `${clean}${datePart}${timePart}${rand}`
}
