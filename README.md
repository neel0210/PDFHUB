
# 📄 PDF HUB — High Performance Document Management

PDF HUB is a premium, unified document manipulation platform built with high-concurrency processing and a sophisticated "Liquid Glass" design system. It provides a full suite of professional PDF utilities designed for performance and security.

![PDF HUB UI](https://img.shields.io/badge/UI-Liquid_Glass-EE4444?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Hosted-GitHub_Pages-black?style=for-the-badge&logo=github)
![Security](https://img.shields.io/badge/Security-Zero_Retention-success?style=for-the-badge)

## 🚀 Key Capabilities

- **Intelligent Merging**: Combine multiple PDF streams into a single high-fidelity document.
- **Visual Organization**: Drag-and-drop page level management with real-time PDF page rendering.
- **Precision Splitting**: Extract individual pages or ranges with surgical precision.
- **Advanced Compression**: Industry-standard algorithms to reduce footprint without sacrificing legibility.
- **Format Conversion**: Bidirectional conversions between PDF, Word (DOCX), and JPG.
- **Enterprise Security**: Secure PDF protection with 256-bit AES encryption and password unlocking.

## 🎨 Design Language

PDF HUB leverages an **iOS 26 Inspired Liquid Glass** design philosophy:
- **Dynamic Backdrop Blurs**: Multi-layered gaussian blurs for depth.
- **Micro-Interactions**: High-frequency physics-based animations via Framer Motion.
- **High Contrast Typography**: Black-on-white and high-saturation red accents for professional legibility.
- **Universal Previews**: Every file in the queue gets a visual thumbnail preview using client-side rendering.

## 🛠️ Technology Stack

- **React 19**: Modern component lifecycle management.
- **PDF-Lib & PDF.js**: Dual-engine approach for visual rendering and binary manipulation.
- **Framer Motion**: State-driven UI transitions.
- **Tailwind CSS**: High-utility styling for rapid iteration.
- **HashRouter**: Ensures 100% compatibility with static hosting providers (GitHub Pages).

---

## 💻 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pdf-hub.git
   cd pdf-hub
   ```

2. **Serve locally**
   This project is designed to run directly using modern ESM imports via an import map. You can use any static server:
   ```bash
   # Option 1: Using npx (recommended)
   npx serve .
   
   # Option 2: Using Python
   python -m http.server
   ```

3. **Navigate** to `http://localhost:3000` (or the port specified).

---

## 🐙 Deployment to GitHub Pages

PDF HUB is optimized for GitHub Pages out of the box.

1. **Push your code** to a public GitHub repository.
2. Go to **Settings > Pages** in your repository.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Select the **main** branch and the **/(root)** folder.
5. **Click Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

*Note: Since the app uses `HashRouter`, all routes will resolve correctly without any special `.htaccess` or `404.html` redirects.*

---

## 🛡️ Privacy & Compliance

- **Zero Storage**: No documents are ever uploaded to a persistent database.
- **Session Purging**: All memory-resident PDF data is automatically cleared 180 seconds after processing.
- **No Third-Party APIs**: Binary manipulation occurs within the browser runtime.

---
*Built with ❤️ in 2026 by Neel0210. Leveraging advanced AI for production-ready architecture.*
