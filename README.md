# Ride Receipt Generator

A small React app to fill in ride details and export a printable receipt as a PDF.

## Setup

```
npm install
npm run dev
```

## Build for production

```
npm run build
npm run preview
```

## What it does

- Left panel: form for company, driver, passenger, pickup, drop off, distance, fare.
- Right panel: live receipt preview, styled as a paper ticket.
- Ticket number is generated automatically from your company name plus date, time, and 4 random characters. Use "Regenerate number" to get a new one.
- "Download PDF" captures the ticket and saves it as a PDF file.

## Customize

- Upload your own logo from the form, or edit the placeholder default in `src/App.jsx`.
- Colors and fonts live in `src/App.css` under the `:root` variables at the top.
- Ticket number format is in `src/utils/generateTicketNumber.js`.
