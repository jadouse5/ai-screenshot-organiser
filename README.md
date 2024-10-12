# SaaS Screenshot Organizer with AI-Powered Analysis and Decentralized Storage

A screenshot organizing tool that uses **AI** to automatically categorize and analyze screenshots. It features **OCR** for text extraction and decentralized storage using **Pinata’s Files API**. This project is designed as a **SaaS** application and is deployed on **Vercel** using **Next.js**.

## Features
- **AI-Powered Screenshot Categorization**: Automatically categorizes screenshots into folders such as "Work", "Shopping", "Entertainment", and more.
- **Optical Character Recognition (OCR)**: Extracts text from screenshots, making them searchable.
- **Decentralized Storage**: Uses **Pinata’s Files API** to store screenshots on **IPFS**, ensuring security and availability.
- **Cross-Device Sync**: Access your organized screenshots from any device.
- **User-Friendly Dashboard**: Simple drag-and-drop interface for uploading and managing screenshots.

## Tech Stack
- **Frontend**: Next.js (React)
- **Backend**: Next.js API routes with Node.js
- **Deployment**: Vercel (serverless functions)
- **Storage**: Pinata Files API for IPFS
- **AI Analysis**: GROQ API’s LLaMA 3.2 11B for OCR and image classification
- **Authentication**: Firebase Auth or Vercel Auth

## Installation

### Prerequisites
- Node.js (v14+)
- A Pinata API key (for IPFS file storage)
- A GROQ API key (for LLaMA 3.2 image analysis)
- Firebase project (if using Firebase Auth)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/screenshot-organizer.git
   cd screenshot-organizer
