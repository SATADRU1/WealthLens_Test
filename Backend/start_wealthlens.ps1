# WealthLens Startup Script
# This script starts both the backend and frontend services

param(
    [string]$Mode = "both",  # Options: "backend", "frontend", "both"
    [switch]$Test = $false   # Add -Test flag to run connection tests
)

Write-Host "🚀 WealthLens AI Financial Assistant" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Get the script directory (now we're in final_backend)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = $ScriptDir
$FrontendDir = Join-Path (Split-Path -Parent $ScriptDir) "Frontend"

# Check if required directories exist
if (-not (Test-Path $BackendDir)) {
    Write-Host "❌ Backend directory not found at: $BackendDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendDir)) {
    Write-Host "❌ Frontend directory not found at: $FrontendDir" -ForegroundColor Red
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

# Function to start backend
function Start-Backend {
    Write-Host "[1/2] 🐍 Starting Backend Server..." -ForegroundColor Yellow
    
    # Check if port 8000 is already in use
    if (Test-Port 8000) {
        Write-Host "⚠️  Port 8000 is already in use. Backend might already be running." -ForegroundColor Yellow
        Write-Host "   You can check http://localhost:8000/health to verify." -ForegroundColor Yellow
        return $true
    }
    
    # Check if Python is available
    try {
        $pythonVersion = python --version 2>&1
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Python not found in PATH" -ForegroundColor Red
        Write-Host "   Please install Python and ensure it's in your PATH." -ForegroundColor Red
        return $false
    }

    # Start the backend server in a new window
    $BackendCmd = "cd '$BackendDir'; python start_server.py"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCmd -WindowStyle Normal -Title "WealthLens Backend"
    
    # Wait for backend to start
    $maxRetries = 10
    $retryCount = 0
    $backendReady = $false
    
    Write-Host "   Waiting for backend to start..." -NoNewline
    
    while (-not $backendReady -and $retryCount -lt $maxRetries) {
        Start-Sleep -Seconds 1
        $retryCount++
        Write-Host "." -NoNewline -ForegroundColor Yellow
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $backendReady = $true
            }
        } catch {
            # Ignore errors and retry
        }
    }
    
    if ($backendReady) {
        Write-Host "`n✅ Backend server is running at http://localhost:8000" -ForegroundColor Green
        Write-Host "   Health check: http://localhost:8000/health" -ForegroundColor Gray
        return $true
    } else {
        Write-Host "`n❌ Failed to start backend server. Please check the backend logs." -ForegroundColor Red
        return $false
    }
}

# Function to start frontend
function Start-Frontend {
    Write-Host "[2/2] 🌐 Starting Frontend Development Server..." -ForegroundColor Yellow
    
    # Check if Node.js is installed
    $nodeVersion = node -v 2>$null
    if (-not $nodeVersion) {
        Write-Host "❌ Node.js is not installed. Please install Node.js 16+ and try again." -ForegroundColor Red
        return $false
    }
    
    # Check if npm is installed
    $npmVersion = npm -v 2>$null
    if (-not $npmVersion) {
        Write-Host "❌ npm is not installed. Please install Node.js 16+ which includes npm." -ForegroundColor Red
        return $false
    }
    
    Push-Location $FrontendDir
    try {
        Write-Host "📍 Working directory: $FrontendDir" -ForegroundColor Gray
        Write-Host "📦 Installing dependencies..." -ForegroundColor Gray
        
        # Install dependencies
        npm install
        
        Write-Host "🚀 Starting Expo development server..." -ForegroundColor Gray
        
        # Start the frontend development server with Expo
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx expo start"
        
        Write-Host "✅ Frontend server started in new window" -ForegroundColor Green
        Write-Host "📱 Scan QR code with Expo Go app to run on mobile" -ForegroundColor Green
        Write-Host "🌐 Or press 'w' to open in web browser" -ForegroundColor Green
        
    }
    finally {
        Pop-Location
    }
}

# Function to run tests
function Run-Tests {
    Write-Host "🧪 Running connection tests..." -ForegroundColor Yellow

    # Check if backend is running
    if (-not (Test-Port 8000)) {
        Write-Host "❌ Backend server is not running on port 8000" -ForegroundColor Red
        Write-Host "   Please start the backend first with: .\start_wealthlens.ps1 -Mode backend" -ForegroundColor Red
        return
    }

    # Test health endpoint
    try {
        Write-Host "🔍 Testing health endpoint..." -ForegroundColor Gray
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend health check passed" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution logic
try {
    if ($Test) {
        Run-Tests
        return
    }
    
    switch ($Mode.ToLower()) {
        "backend" {
            Start-Backend
        }
        "frontend" {
            Start-Frontend
        }
        "both" {
            Write-Host "🔄 Starting both backend and frontend..." -ForegroundColor Magenta
            Start-Backend
            Start-Sleep -Seconds 2
            Start-Frontend
            
            Write-Host ""
            Write-Host "🎉 WealthLens is starting up!" -ForegroundColor Green
            Write-Host "   Backend: http://localhost:8000" -ForegroundColor Gray
            Write-Host "   Frontend: Expo development server" -ForegroundColor Gray
            Write-Host ""
            Write-Host "💡 To test the connection, run: .\start_wealthlens.ps1 -Test" -ForegroundColor Yellow
        }
        default {
            Write-Host "❌ Invalid mode. Use 'backend', 'frontend', or 'both'" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "❌ An error occurred: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ Startup script completed!" -ForegroundColor Cyan
