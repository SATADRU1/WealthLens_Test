#!/usr/bin/env python3
"""
Enhanced Financial Tools for WealthLens
Handles Indian stocks (BSE/NSE), global stocks, and other financial instruments
"""

import requests
import json
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from termcolor import colored
import time

class EnhancedFinancialTools:
    """Enhanced financial tools for comprehensive market data"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.usd_to_inr_rate = 83.0  # Default rate, updated dynamically
        self._update_exchange_rate()

    def _update_exchange_rate(self) -> None:
        """Update USD to INR exchange rate"""
        try:
            # Try to get current exchange rate
            ticker = yf.Ticker("USDINR=X")
            data = ticker.history(period="1d")
            if not data.empty:
                self.usd_to_inr_rate = float(data['Close'].iloc[-1])
                print(colored(f"✅ Updated USD to INR rate: ₹{self.usd_to_inr_rate:.2f}", "green"))
            else:
                print(colored("⚠️ Using default USD to INR rate: ₹83.00", "yellow"))
        except Exception as e:
            print(colored(f"⚠️ Failed to update exchange rate: {e}", "yellow"))

    def convert_usd_to_inr(self, usd_amount: float) -> float:
        """Convert USD amount to INR"""
        return usd_amount * self.usd_to_inr_rate
    
    def get_indian_stock_price(self, symbol: str) -> Dict[str, Any]:
        """
        Get Indian stock price from BSE/NSE
        Supports formats: 'RELIANCE', 'RELIANCE.BO', 'RELIANCE.NS', '500325.BO'
        """
        try:
            print(colored(f"Fetching Indian stock price for {symbol}...", "blue"))
            
            # Clean the symbol
            clean_symbol = symbol.upper().replace('.BO', '').replace('.NS', '')
            
            # Try different symbol formats
            symbols_to_try = [
                f"{clean_symbol}.BO",  # BSE
                f"{clean_symbol}.NS",  # NSE
                clean_symbol,          # Without suffix
            ]
            
            for sym in symbols_to_try:
                try:
                    stock = yf.Ticker(sym)
                    info = stock.info
                    
                    if info and 'regularMarketPrice' in info and info['regularMarketPrice']:
                        # Get historical data for additional info
                        hist = stock.history(period="5d")
                        
                        if not hist.empty:
                            current_price = info['regularMarketPrice']
                            prev_close = info.get('previousClose', hist['Close'].iloc[-2] if len(hist) > 1 else current_price)
                            change = current_price - prev_close
                            change_percent = (change / prev_close) * 100 if prev_close else 0
                            
                            # Get today's data
                            today_data = hist.iloc[-1] if len(hist) > 0 else None
                            
                            result = {
                                "symbol": clean_symbol,
                                "exchange": "BSE" if ".BO" in sym else "NSE" if ".NS" in sym else "Unknown",
                                "current_price": round(current_price, 2),
                                "previous_close": round(prev_close, 2),
                                "change": round(change, 2),
                                "change_percent": round(change_percent, 2),
                                "open": round(today_data['Open'], 2) if today_data is not None else None,
                                "high": round(today_data['High'], 2) if today_data is not None else None,
                                "low": round(today_data['Low'], 2) if today_data is not None else None,
                                "volume": int(today_data['Volume']) if today_data is not None else None,
                                "market_cap": info.get('marketCap'),
                                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            }
                            
                            return {
                                "success": True,
                                "data": result,
                                "message": f"Successfully fetched {clean_symbol} data from {result['exchange']}"
                            }
                            
                except Exception as e:
                    print(colored(f"Failed to fetch {sym}: {e}", "yellow"))
                    continue
            
            # If YFinance fails, try alternative sources
            return self._get_indian_stock_alternative(symbol)
            
        except Exception as e:
            print(colored(f"Error in get_indian_stock_price: {e}", "red"))
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to fetch stock price for {symbol}"
            }
    
    def _get_indian_stock_alternative(self, symbol: str) -> Dict[str, Any]:
        """Alternative method for Indian stocks using web scraping"""
        try:
            # Try to get data from MoneyControl or similar
            clean_symbol = symbol.upper().replace('.BO', '').replace('.NS', '')
            
            # This is a fallback - in production you'd want to use proper APIs
            return {
                "success": False,
                "error": "Alternative source not implemented",
                "message": f"Could not fetch {clean_symbol} data. Please check the symbol or try later.",
                "suggestions": [
                    "Verify the stock symbol (e.g., RELIANCE, TCS, INFY)",
                    "Try adding .BO for BSE or .NS for NSE",
                    "Check if the stock is actively traded"
                ]
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Alternative source failed for {symbol}"
            }
    
    def get_global_stock_price(self, symbol: str) -> Dict[str, Any]:
        """Get global stock price using YFinance"""
        try:
            print(colored(f"Fetching global stock price for {symbol}...", "blue"))
            
            stock = yf.Ticker(symbol)
            info = stock.info
            
            if not info or 'regularMarketPrice' not in info:
                return {
                    "success": False,
                    "error": "No data available",
                    "message": f"Could not find data for {symbol}"
                }
            
            current_price = info['regularMarketPrice']
            prev_close = info.get('previousClose', current_price)
            change = current_price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0
            
            # Get historical data
            hist = stock.history(period="5d")
            today_data = hist.iloc[-1] if len(hist) > 0 else None
            
            # Convert to INR if the original currency is USD
            original_currency = info.get('currency', 'USD')
            if original_currency == 'USD':
                current_price_inr = self.convert_usd_to_inr(current_price)
                prev_close_inr = self.convert_usd_to_inr(prev_close)
                change_inr = self.convert_usd_to_inr(change)
                open_inr = self.convert_usd_to_inr(today_data['Open']) if today_data is not None else None
                high_inr = self.convert_usd_to_inr(today_data['High']) if today_data is not None else None
                low_inr = self.convert_usd_to_inr(today_data['Low']) if today_data is not None else None

                result = {
                    "symbol": symbol,
                    "company_name": info.get('longName', info.get('shortName', symbol)),
                    "current_price": round(current_price_inr, 2),
                    "previous_close": round(prev_close_inr, 2),
                    "change": round(change_inr, 2),
                    "change_percent": round(change_percent, 2),
                    "open": round(open_inr, 2) if open_inr is not None else None,
                    "high": round(high_inr, 2) if high_inr is not None else None,
                    "low": round(low_inr, 2) if low_inr is not None else None,
                    "volume": int(today_data['Volume']) if today_data is not None else None,
                    "market_cap": info.get('marketCap'),
                    "currency": "INR",
                    "original_currency": original_currency,
                    "exchange_rate": self.usd_to_inr_rate,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            else:
                # For non-USD currencies (like INR), keep original values
                result = {
                    "symbol": symbol,
                    "company_name": info.get('longName', info.get('shortName', symbol)),
                    "current_price": round(current_price, 2),
                    "previous_close": round(prev_close, 2),
                    "change": round(change, 2),
                    "change_percent": round(change_percent, 2),
                    "open": round(today_data['Open'], 2) if today_data is not None else None,
                    "high": round(today_data['High'], 2) if today_data is not None else None,
                    "low": round(today_data['Low'], 2) if today_data is not None else None,
                    "volume": int(today_data['Volume']) if today_data is not None else None,
                    "market_cap": info.get('marketCap'),
                    "currency": original_currency,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            
            return {
                "success": True,
                "data": result,
                "message": f"Successfully fetched {symbol} data"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to fetch stock price for {symbol}"
            }
    
    def get_market_indices(self) -> Dict[str, Any]:
        """Get major market indices"""
        try:
            indices = {
                "S&P 500": "^GSPC",
                "NASDAQ": "^IXIC", 
                "Dow Jones": "^DJI",
                "NIFTY 50": "^NSEI",
                "SENSEX": "^BSESN",
                "FTSE 100": "^FTSE",
                "DAX": "^GDAXI",
                "Nikkei 225": "^N225"
            }
            
            results = {}
            for name, symbol in indices.items():
                try:
                    data = self.get_global_stock_price(symbol)
                    if data["success"]:
                        results[name] = data["data"]
                    time.sleep(0.1)  # Rate limiting
                except Exception as e:
                    print(colored(f"Failed to fetch {name}: {e}", "yellow"))
                    continue
            
            return {
                "success": True,
                "data": results,
                "message": f"Fetched {len(results)} market indices"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to fetch market indices"
            }
    
    def format_stock_response(self, stock_data: Dict[str, Any]) -> str:
        """Format stock data into a beautiful markdown response"""
        if not stock_data.get("success"):
            return f"❌ **Error:** {stock_data.get('message', 'Failed to fetch stock data')}"

        data = stock_data["data"]
        symbol = data['symbol']

        # Determine if it's an Indian stock
        is_indian = data.get("exchange") in ["BSE", "NSE"]

        # Get price data
        current_price = data['current_price']
        change = data['change']
        change_percent = data['change_percent']

        # Determine trend indicators
        if change > 0:
            trend_emoji = "📈"
            change_emoji = "🟢"
            change_sign = "+"
        elif change < 0:
            trend_emoji = "📉"
            change_emoji = "🔴"
            change_sign = ""
        else:
            trend_emoji = "➡️"
            change_emoji = "⚪"
            change_sign = ""

        # Start building the response
        response = f"## 📊 Stock Information for {symbol}\n\n"

        # Current price section
        response += f"**Current Price:** 💰 ₹{current_price:,.2f}\n"
        response += f"**Change:** {change_emoji} {change_sign}₹{change:,.2f} ({change_sign}{change_percent:.2f}%) {trend_emoji}\n\n"

        # Key metrics section
        response += "### 📈 Key Metrics\n"

        if is_indian:
            response += f"• **Exchange:** {data['exchange']}\n"

        response += f"• **Previous Close:** ₹{data['previous_close']:,.2f}\n"

        if data.get('open'):
            response += f"• **Open:** ₹{data['open']:,.2f}\n"
        if data.get('high'):
            response += f"• **High:** ₹{data['high']:,.2f}\n"
        if data.get('low'):
            response += f"• **Low:** ₹{data['low']:,.2f}\n"
        if data.get('volume'):
            response += f"• **Volume:** {data['volume']:,}\n"

        if data.get('market_cap'):
            market_cap = data['market_cap']
            if market_cap:
                if market_cap > 1e12:
                    market_cap_str = f"₹{market_cap/1e12:.2f}T"
                elif market_cap > 1e9:
                    market_cap_str = f"₹{market_cap/1e9:.2f}B"
                elif market_cap > 1e6:
                    market_cap_str = f"₹{market_cap/1e6:.2f}M"
                else:
                    market_cap_str = f"₹{market_cap:,}"
                response += f"• **Market Cap:** {market_cap_str}\n"
        
        # Add timestamp and footer
        response += f"\n*Last Updated: {data['timestamp']}*\n\n"
        response += "---\n"
        response += "*Real-time data powered by WealthLens AI* 🚀"

        return response
    
    def get_crypto_price(self, symbol: str) -> Dict[str, Any]:
        """Get cryptocurrency price"""
        try:
            # Add USD suffix if not present
            if not symbol.endswith('-USD'):
                symbol = f"{symbol}-USD"
            
            return self.get_global_stock_price(symbol)
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to fetch crypto price for {symbol}"
            }

# Create a global instance
enhanced_financial_tools = EnhancedFinancialTools()

# Example usage
if __name__ == "__main__":
    tools = enhanced_financial_tools
    
    # Test Indian stocks
    print("Testing Indian stocks...")
    result = tools.get_indian_stock_price("RELIANCE")
    print(tools.format_stock_response(result))
    
    # Test global stocks
    print("\nTesting global stocks...")
    result = tools.get_global_stock_price("AAPL")
    print(tools.format_stock_response(result))
    
    # Test market indices
    print("\nTesting market indices...")
    result = tools.get_market_indices()
    print(f"Fetched {len(result.get('data', {}))} indices")
