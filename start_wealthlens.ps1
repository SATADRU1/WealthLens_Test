# WealthLens Startup Script
# This script starts both the backend and frontend for WealthLens

Write-Host "🚀 Starting WealthLens Application" -ForegroundColor Green
Write-Host "=" * 50

# Check if we're in the correct directory
if (-not (Test-Path "Backend") -or -not (Test-Path "Frontend")) {
    Write-Host "❌ Error: Please run this script from the WealthLens_Test directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)"
    exit 1
}

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are available
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow

if (Test-Port 8000) {
    Write-Host "⚠️  Port 8000 is already in use. Backend might already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 8000 is available for backend" -ForegroundColor Green
}

if (Test-Port 8081) {
    Write-Host "⚠️  Port 8081 is already in use. Frontend might already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 8081 is available for frontend" -ForegroundColor Green
}

Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Gray

# Check if virtual environment exists
if (Test-Path "Backend\venv") {
    Write-Host "✅ Virtual environment found" -ForegroundColor Green
} else {
    Write-Host "❌ Virtual environment not found. Creating one..." -ForegroundColor Red
    Set-Location Backend
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
    Set-Location ..
}

# Start backend in a new PowerShell window
$backendScript = @"
Set-Location '$PWD\Backend'
.\venv\Scripts\Activate.ps1
Write-Host '🚀 Starting WealthLens Backend...' -ForegroundColor Green
Write-Host 'Backend URL: http://localhost:8000' -ForegroundColor Cyan
Write-Host 'Health Check: http://localhost:8000/health' -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop the backend' -ForegroundColor Yellow
Write-Host '=' * 50
python simple_server.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a moment for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test backend connection
$backendReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 2
        if ($response.status -eq "healthy") {
            Write-Host "✅ Backend is ready!" -ForegroundColor Green
            $backendReady = $true
            break
        }
    }
    catch {
        Write-Host "⏳ Waiting for backend... (attempt $i/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "⚠️  Backend might not be ready yet, but continuing with frontend..." -ForegroundColor Yellow
}

Write-Host ""

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:8081" -ForegroundColor Gray

# Check if node_modules exists
if (Test-Path "Frontend\node_modules") {
    Write-Host "✅ Node modules found" -ForegroundColor Green
} else {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location Frontend
    npm install
    Set-Location ..
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Start frontend in a new PowerShell window
$frontendScript = @"
Set-Location '$PWD\Frontend'
Write-Host '🎨 Starting WealthLens Frontend...' -ForegroundColor Green
Write-Host 'Web URL: http://localhost:8081' -ForegroundColor Cyan
Write-Host 'Scan QR code with Expo Go for mobile testing' -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop the frontend' -ForegroundColor Yellow
Write-Host '=' * 50
npm start
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎉 WealthLens is starting up!" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "📱 Frontend (Web): http://localhost:8081" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🏥 Health Check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:8081 in your browser" -ForegroundColor White
Write-Host "2. Navigate to the AI Chat section" -ForegroundColor White
Write-Host "3. Test the chat functionality" -ForegroundColor White
Write-Host "4. For mobile testing, scan the QR code with Expo Go" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop the application:" -ForegroundColor Red
Write-Host "- Close both PowerShell windows that opened" -ForegroundColor White
Write-Host "- Or press Ctrl+C in each window" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open the web application..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open web browser
Start-Process "http://localhost:8081"

Write-Host "✅ WealthLens startup complete!" -ForegroundColor Green
