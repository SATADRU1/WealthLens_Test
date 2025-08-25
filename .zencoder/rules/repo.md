---
description: Repository Information Overview
alwaysApply: true
---

# WealthLens Information

## Summary
WealthLens is a comprehensive financial management application with an AI-powered chatbot backend and a React Native frontend. It provides financial assistance, investment tracking, and educational resources through a mobile and web interface.

## Structure
- **Backend/**: Python FastAPI server with AI capabilities
- **Frontend/**: React Native application with Expo support
- **db/**: Database files for vector storage
- **start_wealthlens.ps1**: Automated startup script

## Projects

### Backend
**Configuration File**: requirements.txt

#### Language & Runtime
**Language**: Python
**Version**: 3.10
**Framework**: FastAPI
**Package Manager**: pip

#### Dependencies
**Main Dependencies**:
- langchain ecosystem (langchain, langchain_groq, langchain_ollama)
- fastapi & uvicorn
- google-generativeai
- yfinance
- requests & beautifulsoup4

#### Build & Installation
```bash
cd Backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

#### Main Files
- **simple_server.py**: Main FastAPI server implementation
- **run.py**: Application entry point
- **tools.py**: AI assistant tools
- **models.py**: Data models
- **utils/**: Utility functions and helpers

#### Testing
**Test Location**: Backend/utils/test.py
**Run Command**:
```bash
python utils/test.py
```

### Frontend
**Configuration File**: package.json

#### Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: Node.js (React Native)
**Framework**: React Native with Expo
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- expo (v53.0.0)
- react (19.0.0)
- react-native (0.79.1)
- expo-router (5.0.2)
- react-native-chart-kit
- react-native-svg
- @react-native-async-storage/async-storage

**Development Dependencies**:
- typescript (5.8.3)
- nativewind (4.1.23)
- tailwindcss (4.1.12)
- eslint (9.0.0)

#### Build & Installation
```bash
cd Frontend
npm install
npm start
```

#### Main Files
- **app/**: Main application routes and screens
- **components/**: Reusable UI components
- **contexts/**: React context providers
- **services/**: API services and data fetching
- **hooks/**: Custom React hooks

## Usage & Operations
**Start Backend**:
```bash
cd Backend
.\venv\Scripts\Activate.ps1
python simple_server.py
```

**Start Frontend**:
```bash
cd Frontend
npm start
```

**Automated Startup**:
```bash
.\start_wealthlens.ps1
```

## Access Points
- **Web Application**: http://localhost:8081
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Mobile**: Scan QR code with Expo Go app