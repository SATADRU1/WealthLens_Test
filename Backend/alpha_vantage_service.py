#!/usr/bin/env python3
"""
Alpha Vantage API Service for Accurate Stock Data
Provides real-time stock prices with automatic INR conversion
"""

import os
import requests
import time
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from termcolor import colored

load_dotenv()

class AlphaVantageService:
    def __init__(self):
        self.api_key = os.environ.get("ALPHA_VANTAGE_API_KEY")
        self.base_url = "https://www.alphavantage.co/query"
        self.usd_to_inr_rate = 83.0  # Default rate, will be updated dynamically
        
        if self.api_key:
            print(colored("✅ Alpha Vantage API initialized", "green"))
            self._update_exchange_rate()
        else:
            print(colored("⚠️ Alpha Vantage API key not found", "yellow"))
    
    def is_available(self) -> bool:
        """Check if Alpha Vantage service is available"""
        return bool(self.api_key)
    
    def _update_exchange_rate(self) -> None:
        """Update USD to INR exchange rate"""
        try:
            params = {
                'function': 'CURRENCY_EXCHANGE_RATE',
                'from_currency': 'USD',
                'to_currency': 'INR',
                'apikey': self.api_key
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            data = response.json()
            
            if 'Realtime Currency Exchange Rate' in data:
                rate = float(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
                self.usd_to_inr_rate = rate
                print(colored(f"✅ Updated USD to INR rate: ₹{rate:.2f}", "green"))
            else:
                print(colored("⚠️ Using default USD to INR rate: ₹83.00", "yellow"))
                
        except Exception as e:
            print(colored(f"⚠️ Failed to update exchange rate: {e}", "yellow"))
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get real-time stock quote with INR conversion"""
        if not self.is_available():
            return {"success": False, "message": "Alpha Vantage API not available"}
        
        try:
            # Get stock quote
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': self.api_key
            }
            
            response = requests.get(self.base_url, params=params, timeout=15)
            data = response.json()
            
            if 'Global Quote' in data:
                quote = data['Global Quote']
                
                # Extract data
                current_price_usd = float(quote.get('05. price', 0))
                change_usd = float(quote.get('09. change', 0))
                change_percent = quote.get('10. change percent', '0%').replace('%', '')
                
                # Convert to INR
                current_price_inr = current_price_usd * self.usd_to_inr_rate
                change_inr = change_usd * self.usd_to_inr_rate
                
                return {
                    "success": True,
                    "data": {
                        "symbol": quote.get('01. symbol', symbol),
                        "current_price": round(current_price_inr, 2),
                        "change": round(change_inr, 2),
                        "change_percent": float(change_percent),
                        "currency": "INR",
                        "original_currency": "USD",
                        "exchange_rate": self.usd_to_inr_rate,
                        "open": round(float(quote.get('02. open', 0)) * self.usd_to_inr_rate, 2),
                        "high": round(float(quote.get('03. high', 0)) * self.usd_to_inr_rate, 2),
                        "low": round(float(quote.get('04. low', 0)) * self.usd_to_inr_rate, 2),
                        "previous_close": round(float(quote.get('08. previous close', 0)) * self.usd_to_inr_rate, 2),
                        "volume": quote.get('06. volume', 'N/A'),
                        "latest_trading_day": quote.get('07. latest trading day', 'N/A'),
                        "source": "Alpha Vantage"
                    }
                }
            else:
                return {
                    "success": False,
                    "message": f"No data found for symbol '{symbol}' in Alpha Vantage",
                    "suggestions": [
                        "Check if the symbol is correct (e.g., AAPL for Apple)",
                        "Try adding exchange suffix (e.g., RELIANCE.BSE)",
                        "Verify the company is publicly traded"
                    ]
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Alpha Vantage API error: {str(e)}",
                "suggestions": ["Check internet connection", "Verify API key", "Try again later"]
            }
    
    def get_indian_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get Indian stock quote (already in INR)"""
        # For Indian stocks, try with .BSE or .NS suffix
        indian_symbols = [symbol, f"{symbol}.BSE", f"{symbol}.NS"]
        
        for sym in indian_symbols:
            try:
                params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': sym,
                    'apikey': self.api_key
                }
                
                response = requests.get(self.base_url, params=params, timeout=15)
                data = response.json()
                
                if 'Global Quote' in data and data['Global Quote']:
                    quote = data['Global Quote']
                    
                    return {
                        "success": True,
                        "data": {
                            "symbol": quote.get('01. symbol', symbol),
                            "current_price": round(float(quote.get('05. price', 0)), 2),
                            "change": round(float(quote.get('09. change', 0)), 2),
                            "change_percent": float(quote.get('10. change percent', '0%').replace('%', '')),
                            "currency": "INR",
                            "open": round(float(quote.get('02. open', 0)), 2),
                            "high": round(float(quote.get('03. high', 0)), 2),
                            "low": round(float(quote.get('04. low', 0)), 2),
                            "previous_close": round(float(quote.get('08. previous close', 0)), 2),
                            "volume": quote.get('06. volume', 'N/A'),
                            "latest_trading_day": quote.get('07. latest trading day', 'N/A'),
                            "source": "Alpha Vantage (Indian Market)"
                        }
                    }
                    
                time.sleep(0.2)  # Rate limiting
                
            except Exception as e:
                continue
        
        return {
            "success": False,
            "message": f"Indian stock '{symbol}' not found in Alpha Vantage",
            "suggestions": [
                "Try the exact NSE/BSE symbol (e.g., TATAMOTORS)",
                "Check if the company is listed on Indian exchanges",
                "Verify the symbol spelling"
            ]
        }

# Global instance
alpha_vantage_service = AlphaVantageService()

def get_alpha_vantage_service() -> AlphaVantageService:
    """Get the global Alpha Vantage service instance"""
    return alpha_vantage_service
