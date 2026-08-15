# 🌿 BloomSense — Precision Botanical AI & Rural Crop Health Ecosystem

[![IEEE YESIST12 Grand Finale](https://img.shields.io/badge/IEEE_YESIST12-Grand_Finale_Finalist-00629B?style=for-the-badge&logo=ieee&logoColor=white)](https://ieeeyesist12.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_3.1-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> **BloomSense** is an end-to-end, offline-capable precision agriculture platform built to protect the agricultural heartland of Bharat. Combining Google Gemini multimodal AI vision, ESP32-S3 edge hardware, real-time contagion mapping, and collaborative farmer community intelligence, BloomSense puts clinical-grade crop diagnostics into the hands of every farmer.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Agri-Probe Edge Hardware](#-agri-probe-edge-hardware)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Achievements](#-achievements)
- [Roadmap](#-roadmap)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 📖 Overview

Smallholder farmers lose **30% to 40% of their annual crop yields** to preventable fungal infections, bacterial blights, and pest infestations. In rural regions:
- Agricultural extension officers are often located far away.
- Diagnostic lab results take weeks.
- Field connectivity is erratic or non-existent.

**BloomSense** bridges this gap by providing an instant, offline-capable agronomic intelligence ecosystem:
1. **Instant Leaf Diagnostics**: Point-and-shoot camera identification of 50+ diseases with 98.4% clinical confidence.
2. **5 km Contagion Alert Network**: Shared GIS map logging GPS infection signatures to alert nearby farms before pathogens spread.
3. **Farmer Community Hub**: Hyperlocal social layer for peer knowledge sharing, treatment validation, and agricultural discussions.
4. **Offline Edge Hardware**: Purpose-built ESP32-S3 Agri-Probe scanner running on-device quantized models with zero internet dependency.

---

## ✨ Key Features

### 🔬 1. AI Plant & Disease Scanning
- Powered by **Google Gemini 3.1 Pro & Flash** multimodal vision.
- Identifies pathogens, severity levels, disease stages, and delivers immediate dual treatment protocols:
  - **Chemical / Agronomic Treatment**: Dosage, safety periods, and chemical compounds.
  - **Organic & Ayurvedic Remedies**: Traditional, cost-effective bio-pesticide formulations.

### 👥 2. Farmer Community Hub
- Real-time social layer powered by Firebase Firestore.
- Post crop updates, share scan diagnoses, react, and exchange localized farming techniques.
- Reduces rural isolation by creating a collective defense network against pest outbreaks.

### 🗺️ 3. Predictive Disease Spread Heatmap & Alert Network
- Interactive map powered by **React-Leaflet** with 4 switchable tile layers (*Dark*, *Voyager*, *High-Res Satellite with Road Overlays*, and *Topographic*).
- Multi-ring severity indicators (High Risk, Medium, Low).
- Proximity engine computes a 5 km outbreak perimeter to notify neighboring farms automatically.

### 🌦️ 4. Hyper-Local Weather Intelligence & Crop Phase Calendar
- Real-time atmospheric telemetry (temperature, humidity, wind, UV index) via **Open-Meteo API** correlated with disease incubation risk models.
- Interactive day-by-day Crop Calendar mapping sowing, vegetative, flowering, and harvest windows with daily micro-tasks.

### 🌿 5. Botanical Archive & Phytochemical Intelligence
- Searchable catalog of medicinal herbs (Ashwagandha, Tulsi, Neem, Brahmi, Turmeric, Aloe Vera, etc.).
- Dynamic multi-step fallback pipeline connected to Wikipedia APIs with a 100+ botanical taxonomic keyword validation filter to ensure pure plant domain data.

### 🌐 6. 14+ Regional Indian Languages & PWA
- Complete multi-lingual support (Hindi, Odia, Bengali, Telugu, Tamil, Marathi, Punjabi, Gujarati, Malayalam, Kannada, Assamese, Urdu, etc.) via Google Translate API.
- Fully installable Progressive Web App (PWA) with Service Worker offline caching for zero-signal field operation.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BLOOMSENSE ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
┌──────────────────────────────┐                       ┌──────────────────────────────┐
│     INPUT & EDGE LAYER       │                       │    CLIENT / FRONTEND LAYER   │
│ • ESP32-S3 Agri-Probe        │                       │ • React 18 + Vite PWA        │
│ • 200x Optical Macro Lens    │  ── (WiFi / Sync) ──► │ • Tailwind CSS Liquid Glass  │
│ • Smartphone Camera (PWA)    │                       │ • Framer Motion Animations   │
│ • GPS Coordinates & Weather  │                       │ • Google Model-Viewer (3D)   │
└──────────────────────────────┘                       └──────────────────────────────┘
                                                                       │
                                                                       ▼
┌──────────────────────────────┐                       ┌──────────────────────────────┐
│    OUTPUT & IMPACT LAYER     │                       │    CLOUD & AI INTELLIGENCE   │
│ • 98.4% Leaf Diagnostic      │                       │ • Google Gemini Multimodal   │
│ • 5 km Contagion Outbreak    │ ◄── (Realtime Sync) ──│ • Firebase Firestore (NoSQL) │
│ • Farmer Community Feed      │                       │ • Firebase Auth & Storage    │
│ • 14+ Regional Languages     │                       │ • Open-Meteo Weather API     │
└──────────────────────────────┘                       └──────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technology / Library |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Styling & Design** | Tailwind CSS 4, Custom Liquid-Glass Glassmorphism |
| **Animation & 3D** | Framer Motion, Google Model Viewer (`@google/model-viewer`) |
| **AI & Multimodal Vision** | Google Gemini 3.1 Pro & Flash APIs |
| **Database & Auth** | Firebase Firestore (Realtime DB), Firebase Authentication, Firebase Storage |
| **GIS & Mapping** | Leaflet.js, React-Leaflet, CARTO Basemaps, Esri World Imagery |
| **APIs & Data** | Open-Meteo Weather API, Wikipedia REST & OpenSearch APIs |
| **PWA & Offline** | Vite PWA Plugin, Workbox Service Worker, Local Storage |
| **Hardware** | ESP32-S3 (240 MHz Dual-Core, 16MB Flash), C++ / Arduino Framework |

---

## 🔬 Agri-Probe Edge Hardware

The **Agri-Probe (Neural Leaf)** is a purpose-built field diagnostic scanner:

- **Processor:** ESP32-S3 Dual-Core Xtensa LX7 @ 240 MHz, 16MB Flash, 8MB PSRAM.
- **Optics:** 200x Optical Macro Lens Assembly with integrated 6-SMD LED Ring Light (2mm focal depth for spore-level detection).
- **Battery:** 14-hour Li-Ion battery with smart sleep-wake trigger logic (~2,000 scans/charge).
- **Enclosure:** Rugged, IP65 water- and dust-resistant casing.
- **Connectivity:** Hybrid offline-first architecture; runs quantized vision models locally, auto-syncing to cloud whenever a signal is detected.

---

## 📁 Project Structure

```bash
BloomSense/
├── public/                     # 3D GLB models, icons, and static assets
│   ├── AgriProbe-compressed.glb
│   ├── utility_robot.glb
│   └── ...
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── DiseaseMap.jsx      # React-Leaflet GIS heatmap
│   │   ├── RobotGuide.jsx      # 3D Interactive AI Guide
│   │   └── ...
│   ├── data/                   # Constants, mock data, and advisories
│   │   ├── advisories.json
│   │   └── constants.js
│   ├── pages/                  # Main page views
│   │   ├── About.jsx           # Mission & platform architecture
│   │   ├── Community.jsx       # Real-time farmer feed & discussions
│   │   ├── CropCalendar.jsx    # Growth cycle task manager
│   │   └── Hardware.jsx        # 3D Agri-Probe scanner viewer & specs
│   ├── firebase.js             # Firebase initialization & Firestore helpers
│   ├── App.jsx                 # Core application & AI scanning workflows
│   ├── index.css               # Design system & Leaflet glassmorphism styles
│   └── main.jsx                # App entry point & routing
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChandraPrakashMishra001/BloomSense-web.git
   cd BloomSense-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root (see template below).

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🏆 Achievements

- **IEEE YESIST12 Grand Finale Finalist**: Selected for the global grand finale in recognition of innovative social impact and precision agricultural technology.

---

## 🗺️ Roadmap

- [ ] **Multispectral Drone Imagery**: Ingest aerial drone feeds for field-scale crop canopy disease mapping.
- [ ] **Smart Sprayer BLE Sync**: Direct Bluetooth integration with tractor pesticide sprayers for variable-rate application.
- [ ] **Verified Agronomist Badges**: Dedicated expert consultation queues in the Community Hub.
- [ ] **Voice-First Dialect Processing**: Full voice-in and voice-out conversational diagnostics for non-literate farmers.

---

## 👨‍💻 Author & Acknowledgments

- **Chandra Prakash Mishra** — Creator & Lead Developer
  - LinkedIn: [Chandra Prakash Mishra](https://www.linkedin.com/in/chandra-prakash-mishra-zx277)
  - Email: [mishrac373@gmail.com](mailto:mishrac373@gmail.com)

Distributed under the MIT License. See `LICENSE` for more information.
