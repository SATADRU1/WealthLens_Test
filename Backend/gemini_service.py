#!/usr/bin/env python3
"""
Gemini AI Service for Text Summarization and Enhancement
This service uses Google's Gemini API for text summarization and markdown formatting.
"""

import os
import re
from typing import Optional, Dict, Any
from dotenv import load_dotenv

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  Google Generative AI not available. Install with: pip install google-generativeai")

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model = None
        self.initialized = False
        
        if GEMINI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.initialized = True
                print("✅ Gemini AI service initialized successfully")
            except Exception as e:
                print(f"❌ Failed to initialize Gemini AI: {e}")
        else:
            print("⚠️  Gemini API key not found or library not available")
    
    def is_available(self) -> bool:
        """Check if Gemini service is available and initialized"""
        return self.initialized and GEMINI_AVAILABLE
    
    def clean_markdown(self, text: str) -> str:
        """Clean and improve markdown formatting"""
        if not text:
            return text
        
        # Fix common markdown issues
        text = re.sub(r'\*\*([^*]+)\*\*', r'**\1**', text)  # Fix bold formatting
        text = re.sub(r'\*([^*]+)\*', r'*\1*', text)  # Fix italic formatting
        text = re.sub(r'#{1,6}\s*([^\n]+)', lambda m: f"{'#' * min(len(m.group(0).split()[0]), 6)} {m.group(1).strip()}", text)  # Fix headers
        
        # Fix list formatting
        text = re.sub(r'^\s*[\*\-\+]\s+', '• ', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s+', lambda m: f"{m.group(0).strip()} ", text, flags=re.MULTILINE)
        
        # Fix line breaks and spacing
        text = re.sub(r'\n{3,}', '\n\n', text)  # Remove excessive line breaks
        text = re.sub(r'[ \t]+\n', '\n', text)  # Remove trailing spaces
        
        # Fix emoji encoding issues
        emoji_fixes = {
            'ð': '📈', 'ð´': '📉', 'ð': '💰', 'ð¢': '🟢', 'ð´': '🔴',
            'â¹': '₹', 'â': '✅', 'â': '❌', 'â ': '⚠️'
        }
        for old, new in emoji_fixes.items():
            text = text.replace(old, new)
        
        return text.strip()
    
    def summarize_text(self, text: str, max_length: int = 500, style: str = "concise") -> str:
        """
        Summarize text using Gemini AI
        
        Args:
            text: Text to summarize
            max_length: Maximum length of summary
            style: Summary style ('concise', 'detailed', 'bullet_points')
        """
        if not self.is_available():
            return self._fallback_summarize(text, max_length)
        
        try:
            # Create appropriate prompt based on style
            if style == "bullet_points":
                prompt = f"""
                Summarize the following financial analysis in bullet points format using PLAIN TEXT only.
                Keep it under {max_length} characters.

                **FORMATTING REQUIREMENTS:**
                - Use simple text with clear headings (no markdown symbols)
                - Include financial emojis (📈, 📉, 💰, 📊, 🟢, 🔴, ⚠️)
                - Structure with clear sections
                - Format numbers and percentages clearly
                - Use simple dashes (-) for bullet points
                - Focus on key insights, recommendations, and important data points
                - DO NOT use markdown formatting symbols

                Text to summarize:
                {text}
                """
            elif style == "detailed":
                prompt = f"""
                Create a detailed but concise summary of this financial analysis using PLAIN TEXT only.
                Keep it under {max_length} characters.

                **FORMATTING REQUIREMENTS:**
                - Use simple text with clear headings (no markdown symbols)
                - Include financial emojis (📈, 📉, 💰, 📊, 🟢, 🔴, ⚠️)
                - Structure with sections like "Analysis", "Key Metrics", "Recommendations"
                - Format numbers and percentages clearly
                - Include key metrics, analysis, and recommendations
                - DO NOT use markdown formatting symbols

                Text to summarize:
                {text}
                """
            else:  # concise
                prompt = f"""
                Create a concise summary of this financial analysis using PLAIN TEXT only.
                Keep it under {max_length} characters.

                **FORMATTING REQUIREMENTS:**
                - Use simple text with clear headings (no markdown symbols)
                - Include financial emojis (📈, 📉, 💰, 📊, 🟢, 🔴, ⚠️)
                - Structure with clear sections
                - Format numbers and percentages clearly
                - Focus on the most important points and final recommendation
                - DO NOT use markdown formatting symbols

                Text to summarize:
                {text}
                """
            
            response = self.model.generate_content(prompt)
            summary = response.text if response.text else text
            
            # Clean and format the summary
            summary = self.clean_markdown(summary)
            
            # Ensure it's within length limit
            if len(summary) > max_length:
                summary = summary[:max_length-3] + "..."
            
            return summary
            
        except Exception as e:
            print(f"❌ Gemini summarization failed: {e}")
            return self._fallback_summarize(text, max_length)
    
    def enhance_financial_response(self, text: str) -> str:
        """
        Enhance financial response with better formatting and structure
        """
        if not self.is_available():
            return self.clean_markdown(text)
        
        try:
            prompt = f"""
            Improve the formatting and structure of this financial response using PLAIN TEXT only.

            **FORMATTING REQUIREMENTS:**
            - Use simple text with clear section headings (no markdown symbols like ##, **, etc.)
            - Include relevant financial emojis (📈, 📉, 💰, 📊, 🟢, 🔴, ⚠️, 💡)
            - Structure with clear sections like "Analysis", "Key Points", "Recommendations"
            - Format all numbers, percentages, and currency values clearly
            - Use simple dashes (-) for lists and key insights
            - Make it professional but engaging and easy to read
            - Ensure proper spacing and line breaks
            - Keep all important information but make it more organized
            - DO NOT use any markdown formatting symbols

            Text to enhance:
            {text}
            """
            
            response = self.model.generate_content(prompt)
            enhanced = response.text if response.text else text
            
            return self.clean_markdown(enhanced)
            
        except Exception as e:
            print(f"❌ Gemini enhancement failed: {e}")
            return self.clean_markdown(text)
    
    def _fallback_summarize(self, text: str, max_length: int) -> str:
        """Fallback summarization when Gemini is not available"""
        # Simple text truncation with smart sentence breaking
        if len(text) <= max_length:
            return self.clean_markdown(text)
        
        # Try to break at sentence boundaries
        sentences = text.split('. ')
        summary = ""
        for sentence in sentences:
            if len(summary + sentence + '. ') <= max_length - 3:
                summary += sentence + '. '
            else:
                break
        
        if not summary:
            summary = text[:max_length-3] + "..."
        
        return self.clean_markdown(summary)
    
    def format_stock_response(self, stock_data: Dict[str, Any]) -> str:
        """
        Format stock response with enhanced markdown and emojis
        """
        if not stock_data.get("success"):
            return f"❌ {stock_data.get('message', 'Failed to fetch stock data')}"
        
        data = stock_data.get("data", {})
        symbol = data.get("symbol", "N/A")
        current_price = data.get("current_price", 0)
        change = data.get("change", 0)
        change_percent = data.get("change_percent", 0)
        
        # Determine trend emoji
        trend_emoji = "📈" if change >= 0 else "📉"
        change_emoji = "🟢" if change >= 0 else "🔴"
        
        # Safely format numeric values
        def safe_format_number(value, decimal_places=2):
            if value is None or value == 'N/A':
                return 'N/A'
            try:
                if decimal_places > 0:
                    return f"{float(value):,.{decimal_places}f}"
                else:
                    return f"{int(value):,}"
            except (ValueError, TypeError):
                return str(value)

        def safe_format_currency(value):
            if value is None or value == 'N/A':
                return 'N/A'
            try:
                return f"₹{float(value):,.2f}"
            except (ValueError, TypeError):
                return f"₹{value}"

        # Format the response
        response = f"""## 📊 Stock Information for {symbol}

**Current Price:** 💰 ₹{current_price:,.2f}
**Change:** {change_emoji} ₹{change:+,.2f} ({change_percent:+.2f}%) {trend_emoji}

### 📈 Key Metrics
• **Previous Close:** {safe_format_currency(data.get('previous_close'))}
• **Open:** {safe_format_currency(data.get('open'))}
• **High:** {safe_format_currency(data.get('high'))}
• **Low:** {safe_format_currency(data.get('low'))}
• **Volume:** {safe_format_number(data.get('volume'), 0)}
• **Market Cap:** {safe_format_currency(data.get('market_cap'))}

*Last Updated: {data.get('last_updated', 'N/A')}*
"""
        
        return self.clean_markdown(response)

# Global instance
gemini_service = GeminiService()

def get_gemini_service() -> GeminiService:
    """Get the global Gemini service instance"""
    return gemini_service
