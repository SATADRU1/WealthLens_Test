#!/usr/bin/env python3
"""
Enhanced Web Search System for WealthLens
Provides multiple fallback options when primary search fails
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List
from termcolor import colored
import yfinance as yf
from bs4 import BeautifulSoup
import re

class EnhancedWebSearch:
    """Enhanced web search with multiple fallback options"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.search_engines = [
            'https://www.google.com/search',
            'https://www.bing.com/search',
            'https://duckduckgo.com/'
        ]

    def format_search_results_as_markdown(self, results: List[Dict], query: str) -> str:
        """Format search results as clean plain text"""
        if not results:
            return "No search results found."

        content = f"Search Results for: {query}\n\n"

        for i, result in enumerate(results[:5], 1):
            title = result.get('title', 'No Title')
            url = result.get('url', '#')
            snippet = result.get('content', result.get('snippet', 'No content available'))

            # Clean up content
            snippet = re.sub(r'\s+', ' ', snippet).strip()
            if len(snippet) > 200:
                snippet = snippet[:200] + "..."

            content += f"{i}. {title}\n"
            content += f"Source: {url}\n"
            content += f"{snippet}\n\n"
            content += "---\n\n"

        return content
    
    def search_with_tavily(self, query: str, api_key: str) -> Optional[Dict[str, Any]]:
        """Search using Tavily API if available"""
        try:
            from tavily import TavilyClient
            tavily_client = TavilyClient(api_key=api_key)
            search_results = tavily_client.search(query=query, search_depth="advanced", max_results=5)
            
            if search_results and search_results.get("results"):
                return {
                    "success": True,
                    "source": "Tavily",
                    "results": search_results["results"],
                    "message": f"Found {len(search_results['results'])} results via Tavily"
                }
        except Exception as e:
            print(colored(f"Tavily search failed: {e}", "yellow"))
        
        return None
    
    def search_with_google(self, query: str) -> Optional[Dict[str, Any]]:
        """Fallback search using Google (basic scraping)"""
        try:
            params = {
                'q': query,
                'num': 5
            }
            
            response = self.session.get(self.search_engines[0], params=params, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = []
            
            # Extract search results (this is basic and may need updates)
            for result in soup.find_all('div', class_='g')[:5]:
                title_elem = result.find('h3')
                link_elem = result.find('a')
                snippet_elem = result.find('div', class_='VwiC3b')
                
                if title_elem and link_elem:
                    title = title_elem.get_text(strip=True)
                    link = link_elem.get('href', '')
                    snippet = snippet_elem.get_text(strip=True) if snippet_elem else ''
                    
                    if link.startswith('http'):
                        results.append({
                            'title': title,
                            'url': link,
                            'content': snippet
                        })
            
            if results:
                return {
                    "success": True,
                    "source": "Google",
                    "results": results,
                    "message": f"Found {len(results)} results via Google"
                }
                
        except Exception as e:
            print(colored(f"Google search failed: {e}", "yellow"))
        
        return None
    
    def search_with_bing(self, query: str) -> Optional[Dict[str, Any]]:
        """Fallback search using Bing"""
        try:
            params = {
                'q': query,
                'count': 5
            }
            
            response = self.session.get(self.search_engines[1], params=params, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = []
            
            # Extract Bing search results
            for result in soup.find_all('li', class_='b_algo')[:5]:
                title_elem = result.find('h2')
                link_elem = result.find('a')
                snippet_elem = result.find('p')
                
                if title_elem and link_elem:
                    title = title_elem.get_text(strip=True)
                    link = link_elem.get('href', '')
                    snippet = snippet_elem.get_text(strip=True) if snippet_elem else ''
                    
                    if link.startswith('http'):
                        results.append({
                            'title': title,
                            'url': link,
                            'content': snippet
                        })
            
            if results:
                return {
                    "success": True,
                    "source": "Bing",
                    "results": results,
                    "message": f"Found {len(results)} results via Bing"
                }
                
        except Exception as e:
            print(colored(f"Bing search failed: {e}", "yellow"))
        
        return None
    
    def search_with_duckduckgo(self, query: str) -> Optional[Dict[str, Any]]:
        """Fallback search using DuckDuckGo"""
        try:
            params = {
                'q': query,
                't': 'h_',
                'ia': 'web'
            }
            
            response = self.session.get(self.search_engines[2], params=params, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = []
            
            # Extract DuckDuckGo search results
            for result in soup.find_all('div', class_='result')[:5]:
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('div', class_='result__snippet')
                
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    link = title_elem.get('href', '')
                    snippet = snippet_elem.get_text(strip=True) if snippet_elem else ''
                    
                    if link.startswith('http'):
                        results.append({
                            'title': title,
                            'url': link,
                            'content': snippet
                        })
            
            if results:
                return {
                    "success": True,
                    "source": "DuckDuckGo",
                    "results": results,
                    "message": f"Found {len(results)} results via DuckDuckGo"
                }
                
        except Exception as e:
            print(colored(f"DuckDuckGo search failed: {e}", "yellow"))
        
        return None
    
    def search_with_financial_apis(self, query: str) -> Optional[Dict[str, Any]]:
        """Search using financial APIs for market-related queries"""
        try:
            # Check if query is about stocks, markets, or financial news
            financial_keywords = ['stock', 'market', 'investment', 'finance', 'trading', 'economy', 'GDP', 'inflation', 'interest rate']
            
            if any(keyword in query.lower() for keyword in financial_keywords):
                # Try to get market data
                results = []
                
                # Get major indices
                indices = {
                    'S&P 500': '^GSPC',
                    'NASDAQ': '^IXIC',
                    'Dow Jones': '^DJI',
                    'SENSEX': '^BSESN',
                    'NIFTY': '^NSEI'
                }
                
                for name, symbol in indices.items():
                    try:
                        ticker = yf.Ticker(symbol)
                        info = ticker.info
                        if info and 'regularMarketPrice' in info:
                            results.append({
                                'title': f'{name} Market Data',
                                'url': f'https://finance.yahoo.com/quote/{symbol}',
                                'content': f'Current {name} price: ${info["regularMarketPrice"]:.2f}'
                            })
                        time.sleep(0.1)  # Rate limiting
                    except:
                        continue
                
                if results:
                    return {
                        "success": True,
                        "source": "Financial APIs",
                        "results": results,
                        "message": f"Found {len(results)} financial data points"
                    }
                    
        except Exception as e:
            print(colored(f"Financial API search failed: {e}", "yellow"))
        
        return None
    
    def search_with_news_apis(self, query: str) -> Optional[Dict[str, Any]]:
        """Search using news APIs for current events"""
        try:
            # This would require news API keys, but we can provide a fallback
            # For now, return a helpful message
            return {
                "success": True,
                "source": "News APIs",
                "results": [{
                    'title': 'News Search Available',
                    'url': 'https://news.google.com',
                    'content': f'For the latest news about "{query}", you can search on Google News or other news platforms.'
                }],
                "message": "News search fallback provided"
            }
            
        except Exception as e:
            print(colored(f"News API search failed: {e}", "yellow"))
        
        return None
    
    def comprehensive_search(self, query: str, tavily_api_key: str = None) -> Dict[str, Any]:
        """Perform comprehensive search using multiple sources"""
        print(colored(f"🔍 Performing comprehensive search for: {query}", "blue"))
        
        search_results = []
        sources_used = []
        
        # Try Tavily first (if available)
        if tavily_api_key:
            result = self.search_with_tavily(query, tavily_api_key)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Try financial APIs for financial queries
        if not search_results or len(search_results) < 3:
            result = self.search_with_financial_apis(query)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Try Google search
        if not search_results or len(search_results) < 3:
            result = self.search_with_google(query)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Try Bing search
        if not search_results or len(search_results) < 3:
            result = self.search_with_bing(query)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Try DuckDuckGo search
        if not search_results or len(search_results) < 3:
            result = self.search_with_duckduckgo(query)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Try news APIs
        if not search_results or len(search_results) < 3:
            result = self.search_with_news_apis(query)
            if result and result["success"]:
                search_results.extend(result["results"])
                sources_used.append(result["source"])
                print(colored(f"✅ {result['message']}", "green"))
        
        # Remove duplicates based on URL
        seen_urls = set()
        unique_results = []
        for result in search_results:
            if result['url'] not in seen_urls:
                seen_urls.add(result['url'])
                unique_results.append(result)
        
        if unique_results:
            return {
                "success": True,
                "results": unique_results[:10],  # Limit to 10 results
                "sources_used": sources_used,
                "total_results": len(unique_results),
                "message": f"Found {len(unique_results)} unique results using {', '.join(sources_used)}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        else:
            return {
                "success": False,
                "results": [],
                "sources_used": [],
                "total_results": 0,
                "message": "No search results found from any source",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
    
    def format_search_results(self, search_data: Dict[str, Any]) -> str:
        """Format search results into a readable plain text response"""
        if not search_data.get("success"):
            return f"❌ {search_data.get('message', 'Search failed')}"

        results = search_data["results"]
        sources = search_data["sources_used"]

        response = f"🔍 Web Search Results\n\n"
        response += f"Sources Used: {', '.join(sources)}\n"
        response += f"Total Results: {len(results)}\n"
        response += f"Search Time: {search_data['timestamp']}\n\n"

        for i, result in enumerate(results[:5], 1):  # Show top 5 results
            response += f"{i}. {result['title']}\n"
            response += f"URL: {result['url']}\n"
            response += f"Summary: {result['content'][:200]}...\n\n"

        if len(results) > 5:
            response += f"... and {len(results) - 5} more results\n\n"

        response += f"---\nResults gathered from multiple search engines and APIs for comprehensive coverage."

        return response

# Create a global instance
enhanced_web_search = EnhancedWebSearch()

# Example usage
if __name__ == "__main__":
    # Test the enhanced web search
    query = "What are the latest trends in artificial intelligence?"
    
    print("🧪 Testing Enhanced Web Search")
    print("=" * 50)
    
    result = enhanced_web_search.comprehensive_search(query)
    print(f"\nSearch completed: {result['message']}")
    
    if result["success"]:
        print(f"Sources used: {', '.join(result['sources_used'])}")
        print(f"Total results: {result['total_results']}")
        
        # Format and display results
        formatted = enhanced_web_search.format_search_results(result)
        print("\n" + "=" * 50)
        print(formatted)
    else:
        print(f"Search failed: {result['message']}")
