# Live Investment Opportunities Service using yfinance
import yfinance as yf
import pandas as pd
from typing import Dict, List, Any
from datetime import datetime
import asyncio
import concurrent.futures
from termcolor import colored

class LiveOpportunitiesService:
    """Service to fetch live investment opportunities with real-time prices"""
    
    def __init__(self):
        # Popular stocks for investment opportunities
        self.stock_symbols = {
            # US Stocks
            'AAPL': 'Apple Inc.',
            'GOOGL': 'Alphabet Inc.',
            'MSFT': 'Microsoft Corporation',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.',
            'META': 'Meta Platforms Inc.',
            'NVDA': 'NVIDIA Corporation',
            'NFLX': 'Netflix Inc.',
            'UBER': 'Uber Technologies Inc.',
            'SPOT': 'Spotify Technology S.A.',
            
            # Indian Stocks (NSE)
            'RELIANCE.NS': 'Reliance Industries Ltd.',
            'TCS.NS': 'Tata Consultancy Services Ltd.',
            'INFY.NS': 'Infosys Ltd.',
            'HDFCBANK.NS': 'HDFC Bank Ltd.',
            'ICICIBANK.NS': 'ICICI Bank Ltd.',
            'SBIN.NS': 'State Bank of India',
            'BHARTIARTL.NS': 'Bharti Airtel Ltd.',
            'ITC.NS': 'ITC Ltd.',
            'HINDUNILVR.NS': 'Hindustan Unilever Ltd.',
            'LT.NS': 'Larsen & Toubro Ltd.',
        }
        
        # Cache for storing recent data
        self.cache = {}
        self.cache_duration = 300  # 5 minutes
    
    def get_stock_data(self, symbol: str) -> Dict[str, Any]:
        """Get real-time stock data for a single symbol"""
        try:
            print(colored(f"Fetching live data for {symbol}...", "blue"))
            
            # Check cache first
            cache_key = symbol
            current_time = datetime.now().timestamp()
            
            if cache_key in self.cache:
                cached_data, timestamp = self.cache[cache_key]
                if current_time - timestamp < self.cache_duration:
                    print(colored(f"Using cached data for {symbol}", "green"))
                    return cached_data
            
            # Fetch fresh data
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="1d", interval="1m")
            
            if hist.empty:
                return self._get_fallback_data(symbol)
            
            # Get current price (latest available)
            current_price = hist['Close'].iloc[-1] if not hist.empty else info.get('currentPrice', 0)
            previous_close = info.get('previousClose', current_price)
            
            # Calculate change
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close > 0 else 0
            
            # Prepare data
            stock_data = {
                'symbol': symbol,
                'name': self.stock_symbols.get(symbol, info.get('longName', symbol)),
                'current_price': float(current_price),
                'previous_close': float(previous_close),
                'change': float(change),
                'change_percent': float(change_percent),
                'volume': int(info.get('volume', 0)),
                'market_cap': info.get('marketCap', 0),
                'pe_ratio': info.get('trailingPE', 0),
                'day_high': float(info.get('dayHigh', current_price)),
                'day_low': float(info.get('dayLow', current_price)),
                'fifty_two_week_high': float(info.get('fiftyTwoWeekHigh', current_price)),
                'fifty_two_week_low': float(info.get('fiftyTwoWeekLow', current_price)),
                'currency': info.get('currency', 'USD'),
                'exchange': info.get('exchange', 'NASDAQ'),
                'sector': info.get('sector', 'Technology'),
                'industry': info.get('industry', 'Software'),
                'last_updated': datetime.now().isoformat(),
                'success': True
            }
            
            # Cache the data
            self.cache[cache_key] = (stock_data, current_time)
            
            print(colored(f"✅ Successfully fetched data for {symbol}: ${current_price:.2f}", "green"))
            return stock_data
            
        except Exception as e:
            print(colored(f"❌ Error fetching data for {symbol}: {e}", "red"))
            return self._get_fallback_data(symbol)
    
    def _get_fallback_data(self, symbol: str) -> Dict[str, Any]:
        """Provide fallback data when live fetch fails"""
        fallback_prices = {
            'AAPL': 175.23, 'GOOGL': 2847.56, 'MSFT': 331.78, 'AMZN': 3342.88,
            'TSLA': 248.50, 'META': 298.58, 'NVDA': 875.30, 'NFLX': 486.81,
            'UBER': 71.02, 'SPOT': 165.38,
            'RELIANCE.NS': 2850.55, 'TCS.NS': 3855.70, 'INFY.NS': 1640.80,
            'HDFCBANK.NS': 1680.25, 'ICICIBANK.NS': 1125.10, 'SBIN.NS': 835.50,
            'BHARTIARTL.NS': 1410.00, 'ITC.NS': 462.35, 'HINDUNILVR.NS': 2456.80,
            'LT.NS': 3567.25
        }
        
        price = fallback_prices.get(symbol, 100.0)
        change = (price * 0.01) * (1 if hash(symbol) % 2 == 0 else -1)  # Random-ish change
        
        return {
            'symbol': symbol,
            'name': self.stock_symbols.get(symbol, symbol),
            'current_price': price,
            'previous_close': price - change,
            'change': change,
            'change_percent': (change / (price - change)) * 100,
            'volume': 1000000,
            'market_cap': int(price * 1000000000),
            'pe_ratio': 25.5,
            'day_high': price * 1.02,
            'day_low': price * 0.98,
            'fifty_two_week_high': price * 1.25,
            'fifty_two_week_low': price * 0.75,
            'currency': 'USD' if '.NS' not in symbol else 'INR',
            'exchange': 'NSE' if '.NS' in symbol else 'NASDAQ',
            'sector': 'Technology',
            'industry': 'Software',
            'last_updated': datetime.now().isoformat(),
            'success': False,
            'fallback': True
        }
    
    async def get_multiple_stocks_async(self, symbols: List[str]) -> List[Dict[str, Any]]:
        """Get data for multiple stocks asynchronously"""
        loop = asyncio.get_event_loop()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            tasks = [
                loop.run_in_executor(executor, self.get_stock_data, symbol)
                for symbol in symbols
            ]
            results = await asyncio.gather(*tasks)
        
        return results
    
    def get_trending_stocks(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get trending stocks with live prices"""
        try:
            # Get a subset of popular stocks
            trending_symbols = list(self.stock_symbols.keys())[:limit]
            
            # Use asyncio to fetch data concurrently
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                results = loop.run_until_complete(
                    self.get_multiple_stocks_async(trending_symbols)
                )
            finally:
                loop.close()
            
            # Sort by change percentage (most gainers first)
            results.sort(key=lambda x: x.get('change_percent', 0), reverse=True)
            
            return results
            
        except Exception as e:
            print(colored(f"Error getting trending stocks: {e}", "red"))
            # Return fallback data for trending stocks
            return [self._get_fallback_data(symbol) for symbol in list(self.stock_symbols.keys())[:limit]]
    
    def get_market_movers(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get market movers (gainers and losers)"""
        try:
            all_stocks = self.get_trending_stocks(20)
            
            # Separate gainers and losers
            gainers = [stock for stock in all_stocks if stock.get('change_percent', 0) > 0]
            losers = [stock for stock in all_stocks if stock.get('change_percent', 0) < 0]
            
            # Sort and limit
            gainers.sort(key=lambda x: x.get('change_percent', 0), reverse=True)
            losers.sort(key=lambda x: x.get('change_percent', 0))
            
            return {
                'gainers': gainers[:5],
                'losers': losers[:5],
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(colored(f"Error getting market movers: {e}", "red"))
            return {'gainers': [], 'losers': [], 'error': str(e)}
    
    def search_stocks(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search for stocks by symbol or name"""
        query = query.upper()
        matching_symbols = []
        
        # Search in our predefined symbols
        for symbol, name in self.stock_symbols.items():
            if query in symbol.upper() or query in name.upper():
                matching_symbols.append(symbol)
        
        # Limit results
        matching_symbols = matching_symbols[:limit]
        
        if not matching_symbols:
            return []
        
        # Get live data for matching symbols
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                results = loop.run_until_complete(
                    self.get_multiple_stocks_async(matching_symbols)
                )
            finally:
                loop.close()
            
            return results
            
        except Exception as e:
            print(colored(f"Error searching stocks: {e}", "red"))
            return [self._get_fallback_data(symbol) for symbol in matching_symbols]

# Global instance
live_opportunities_service = LiveOpportunitiesService()

# Test function
if __name__ == "__main__":
    service = LiveOpportunitiesService()
    
    print("Testing single stock...")
    result = service.get_stock_data("AAPL")
    print(f"AAPL: ${result['current_price']:.2f} ({result['change_percent']:+.2f}%)")
    
    print("\nTesting trending stocks...")
    trending = service.get_trending_stocks(5)
    for stock in trending:
        print(f"{stock['symbol']}: ${stock['current_price']:.2f} ({stock['change_percent']:+.2f}%)")
    
    print("\nTesting market movers...")
    movers = service.get_market_movers()
    print(f"Top gainer: {movers['gainers'][0]['symbol'] if movers['gainers'] else 'None'}")
    print(f"Top loser: {movers['losers'][0]['symbol'] if movers['losers'] else 'None'}")
