# WealthLens Mobile Development Startup Script
# This script starts both backend and frontend for mobile development

Write-Host "🚀 Starting WealthLens for Mobile Development..." -ForegroundColor Green

# Get local IP address for mobile development
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
if (-not $localIP) {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress | Select-Object -First 1
}

if (-not $localIP) {
    Write-Host "⚠️  Could not detect local IP address. Using default 192.168.21.247" -ForegroundColor Yellow
    $localIP = "192.168.21.247"
} else {
    Write-Host "📡 Detected local IP: $localIP" -ForegroundColor Cyan
}

# Set environment variable for frontend
$env:EXPO_PUBLIC_LOCAL_IP = $localIP
$env:EXPO_PUBLIC_API_URL = "http://${localIP}:8000"

Write-Host "🔧 Configuration:" -ForegroundColor Blue
Write-Host "   Backend URL: http://${localIP}:8000" -ForegroundColor White
Write-Host "   Frontend will use local IP for mobile connections" -ForegroundColor White

# Function to start backend
function Start-Backend {
    Write-Host "🐍 Starting Backend Server..." -ForegroundColor Yellow
    Set-Location "Backend"
    
    # Check if virtual environment exists
    if (Test-Path "venv") {
        Write-Host "   Activating virtual environment..." -ForegroundColor Gray
        & "venv\Scripts\Activate.ps1"
    } else {
        Write-Host "   ⚠️  Virtual environment not found. Please run setup first." -ForegroundColor Red
        return
    }
    
    # Start the backend server
    Write-Host "   Starting FastAPI server on http://0.0.0.0:8000..." -ForegroundColor Gray
    python run.py
}

# Function to start frontend
function Start-Frontend {
    Write-Host "📱 Starting Frontend (Expo)..." -ForegroundColor Yellow
    Set-Location "Frontend"
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Installing dependencies..." -ForegroundColor Gray
        npm install
    }
    
    # Start Expo development server
    Write-Host "   Starting Expo development server..." -ForegroundColor Gray
    Write-Host "   📱 Use Expo Go app to scan QR code for mobile testing" -ForegroundColor Cyan
    npx expo start --tunnel
}

# Check if both directories exist
if (-not (Test-Path "Backend")) {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "Frontend")) {
    Write-Host "❌ Frontend directory not found!" -ForegroundColor Red
    exit 1
}

# Ask user what to start
Write-Host ""
Write-Host "What would you like to start?" -ForegroundColor Green
Write-Host "1. Backend only" -ForegroundColor White
Write-Host "2. Frontend only" -ForegroundColor White
Write-Host "3. Both (recommended)" -ForegroundColor White
Write-Host "4. Setup instructions" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Start-Backend
    }
    "2" {
        Start-Frontend
    }
    "3" {
        Write-Host "🚀 Starting both Backend and Frontend..." -ForegroundColor Green
        Write-Host "   Backend will start first, then Frontend in a new window" -ForegroundColor Gray
        
        # Start backend in a new PowerShell window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Backend'; if (Test-Path 'venv') { & 'venv\Scripts\Activate.ps1' }; python run.py"
        
        # Wait a moment for backend to start
        Start-Sleep -Seconds 3
        
        # Start frontend
        Start-Frontend
    }
    "4" {
        Write-Host ""
        Write-Host "📋 Setup Instructions for Mobile Development:" -ForegroundColor Green
        Write-Host ""
        Write-Host "1. Backend Setup:" -ForegroundColor Yellow
        Write-Host "   cd Backend" -ForegroundColor Gray
        Write-Host "   python -m venv venv" -ForegroundColor Gray
        Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor Gray
        Write-Host "   pip install -r requirements.txt" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Frontend Setup:" -ForegroundColor Yellow
        Write-Host "   cd Frontend" -ForegroundColor Gray
        Write-Host "   npm install" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Mobile Testing:" -ForegroundColor Yellow
        Write-Host "   - Install Expo Go app on your mobile device" -ForegroundColor Gray
        Write-Host "   - Make sure your mobile and computer are on the same Wi-Fi network" -ForegroundColor Gray
        Write-Host "   - Use Expo Go to scan the QR code when frontend starts" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. API Keys Setup:" -ForegroundColor Yellow
        Write-Host "   - Copy Backend\.env.example to Backend\.env" -ForegroundColor Gray
        Write-Host "   - Add your API keys (GROQ_API_KEY, TAVILY_API_KEY, etc.)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "5. Network Configuration:" -ForegroundColor Yellow
        Write-Host "   - Your local IP is: $localIP" -ForegroundColor Cyan
        Write-Host "   - Backend will be accessible at: http://${localIP}:8000" -ForegroundColor Cyan
        Write-Host "   - Make sure Windows Firewall allows connections on port 8000" -ForegroundColor Gray
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Script completed!" -ForegroundColor Green
