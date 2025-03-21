# COINS PDF Extractor - Frontend

This is the frontend for the COINS PDF Extractor, built for the Princeton University-based FLAME project.

## Built With

- **Next.js**
- **React**
- **TypeScript**
- **Material UI (MUI)**

## Features

- Upload a PDF file and optionally run OCR
- Image preview of each extracted table
- Column mapping to a predefined mappings
- Export selected tables as a ZIP of CSVs

### How to use

To view locally, toggle on `MOCK_MODE = true` in `useFileProcessing.ts`.
```bash
npm install
npm run dev
```
Open http://localhost:3000 to view.

To use with backend server, export the build as static files.
```
npm run build
```