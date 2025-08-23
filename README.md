# WealthLens - AI-Powered Finance Assistant

WealthLens is a comprehensive financial management application with an AI-powered chatbot backend and a React Native frontend.

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)
```powershell
# Run the automated startup script
.\start_wealthlens.ps1
```

### Option 2: Manual Startup

#### Backend Setup
1. Navigate to the Backend directory:
   ```powershell
   cd Backend
   ```

2. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. Start the backend server:
   ```powershell
   python simple_server.py
   ```

#### Frontend Setup
1. Open a new terminal and navigate to Frontend:
   ```powershell
   cd Frontend
   ```

2. Start the frontend:
   ```powershell
   npm start
   ```

## 📱 Access Points

- **Web Application**: http://localhost:8081
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Mobile**: Scan QR code with Expo Go app

## 🧪 Testing the Connection

### Test Backend Directly
```powershell
# Health check
curl http://localhost:8000/health

# Test query
Invoke-RestMethod -Uri "http://localhost:8000/query" -Method POST -ContentType "application/json" -Body '{"query":"Hello","deep_search":false}'
```

### Test Frontend-Backend Integration
1. Open the web app at http://localhost:8081
2. Navigate to the AI Chat section
3. Send a message like "Hello, can you help me with my finances?"
4. Verify you receive a response from the backend

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend health check returns "healthy"
- ✅ Frontend loads without errors
- ✅ Chat messages get responses from the backend
- ✅ No CORS or connection errors in browser console
