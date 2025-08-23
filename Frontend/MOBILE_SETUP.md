# Mobile Development Setup Guide

## Connecting Mobile App to Backend

### 1. Find Your Computer's IP Address

**On Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

**On macOS/Linux:**
```bash
ifconfig
# or
ip addr
```

### 2. Update API Configuration

Edit `Frontend/config/api.ts` and change the `LOCAL_IP` to your computer's IP address:

```typescript
DEV: {
  LOCAL_IP: '192.168.1.100', // ← Change this to your actual IP
  USE_LOCAL_IP: true, // ← Set this to true for mobile testing
},
```

### 3. Start Backend Server

```bash
cd final_backend
python start_server.py
```

The backend will start on `http://0.0.0.0:8000` (accessible from any device on your network)

### 4. Start Frontend Development Server

```bash
cd Frontend
npx expo start
```

### 5. Test on Mobile Device

1. Install Expo Go app on your mobile device
2. Make sure your phone is on the same WiFi network as your computer
3. Scan the QR code from the Expo development server
4. The app should now connect to your backend!

### Troubleshooting

**If connection fails:**
1. Check that both devices are on the same WiFi network
2. Verify your computer's IP address is correct
3. Make sure no firewall is blocking port 8000
4. Try using the health endpoint: `http://YOUR_IP:8000/health`

**For Android emulator:**
- Use `10.0.2.2:8000` instead of localhost

**For iOS simulator:**
- Use `localhost:8000` (works automatically)
