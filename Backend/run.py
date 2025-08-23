# run.py

# Assuming this initializes and returns a Chroma/FAISS etc. vector store
from ingest import vector_store
from agno.agent import Agent
from agno.knowledge.langchain import LangChainKnowledgeBase
# Use centralized LLM providers
from vars import (
    get_llm_id, get_llm_provider,
    MAX_SEARCH_CALLS, MAX_DEPTH
)
from agno.tools.yfinance import YFinanceTools
from deep_research import DeepResearch
# from summarizer import summarize # Not currently used for final synthesis
from tavily import TavilyClient
from live_opportunities import live_opportunities_service

import os
import re
from dotenv import load_dotenv
from rich.console import Console
from termcolor import colored
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import BooleanOutputParser
from datetime import datetime
from typing import Optional

from typing import Optional, Callable, Dict, Any
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
console = Console()

# --- Initialize Tools ---
tavily_api_key = os.environ.get("TAVILY_API_KEY")
if tavily_api_key:
    tavily_client = TavilyClient(api_key=tavily_api_key)
    print(colored("✅ Tavily client initialized", "green"))
else:
    tavily_client = None
    print(colored("⚠️ TAVILY_API_KEY not found - web search will be limited", "yellow"))

# Initialize enhanced financial tools
from enhanced_financial_tools import enhanced_financial_tools
print(colored("✅ Enhanced Financial Tools initialized", "green"))

# Initialize enhanced web search
from enhanced_web_search import enhanced_web_search
print(colored("✅ Enhanced Web Search initialized", "green"))

# Initialize Gemini service for summarization
from gemini_service import get_gemini_service
gemini_service = get_gemini_service()
if gemini_service.is_available():
    print(colored("✅ Gemini AI service initialized", "green"))
else:
    print(colored("⚠️ Gemini AI service not available", "yellow"))

# Initialize Alpha Vantage service for accurate stock data
from alpha_vantage_service import get_alpha_vantage_service
alpha_vantage_service = get_alpha_vantage_service()
if alpha_vantage_service.is_available():
    print(colored("✅ Alpha Vantage service initialized", "green"))
else:
    print(colored("⚠️ Alpha Vantage service not available", "yellow"))

# Initialize Deep Research service
from deep_research import DeepResearch
deep_research_service = DeepResearch()
print(colored("✅ Deep Research service initialized", "green"))

yf_tool = YFinanceTools(
    stock_price=True,
    analyst_recommendations=True,
    stock_fundamentals=True,
    company_info=True,
)
if not hasattr(yf_tool, 'name'):
    yf_tool.name = "YFinanceTools"
if tavily_client and not hasattr(tavily_client, 'name'):
    tavily_client.name = "TavilySearch"

researcher = DeepResearch(
    max_search_calls=MAX_SEARCH_CALLS, max_depth=MAX_DEPTH)


# --- Initialize Knowledge Base ---
try:
    retriever = vector_store.as_retriever(search_kwargs={'k': 3})
except Exception as e:
    print(colored(f"Error initializing vector store/retriever: {e}", "red"))
    print(colored("Knowledge base retrieval will be unavailable.", "yellow"))
    retriever = None

knowledge_base = LangChainKnowledgeBase(
    retriever=retriever) if retriever else None

# --- Initialize LLMs ---
# Ensure framework="langchain" is specified when Langchain specific features like parsers are used
main_llm_langchain = get_llm_provider(get_llm_id("remote"), framework="langchain")
tool_llm_langchain = get_llm_provider(get_llm_id("tool"), framework="langchain")

# Keep Agno-compatible LLMs if needed for Agno Agents
main_llm_agno = get_llm_provider(get_llm_id("remote"))
tool_llm_agno = get_llm_provider(get_llm_id("tool"))


# --- Helper Function for Tool Call Display (Keep if needed) ---
# ... (display_tool_calls function remains the same) ...

# --- Markdown Stripping Function ---
def strip_markdown(text: str) -> str:
    """Remove markdown formatting from text and return clean plain text"""
    if not text:
        return text

    # Remove headers (##, ###, etc.)
    text = re.sub(r'#{1,6}\s*([^\n]+)', r'\1', text)

    # Remove bold and italic formatting
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Remove bold
    text = re.sub(r'\*([^*]+)\*', r'\1', text)      # Remove italic

    # Remove markdown links and keep only the text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

    # Convert bullet points to simple dashes
    text = re.sub(r'^\s*[\*\-\+•]\s+', '- ', text, flags=re.MULTILINE)

    # Clean up excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)  # Remove excessive line breaks
    text = re.sub(r'[ \t]+\n', '\n', text)  # Remove trailing spaces

    return text.strip()

# --- Financial Query Handler ---
def handle_financial_query(query: str) -> Optional[str]:
    """
    Handle financial queries like stock prices, market data, etc.
    Returns formatted response if it's a financial query, None otherwise.
    """
    query_lower = query.lower()
    
    # Check for stock price queries
    stock_keywords = ['stock price', 'stock price of', 'price of', 'share price', 'current price', 'market price']
    if any(keyword in query_lower for keyword in stock_keywords):
        # Extract potential stock symbols - improved logic
        words = query.split()

        # Company name to ticker mapping
        company_tickers = {
            'apple': 'AAPL', 'microsoft': 'MSFT', 'google': 'GOOGL', 'alphabet': 'GOOGL',
            'amazon': 'AMZN', 'tesla': 'TSLA', 'meta': 'META', 'facebook': 'META',
            'nvidia': 'NVDA', 'netflix': 'NFLX', 'uber': 'UBER', 'spotify': 'SPOT',
            'reliance': 'RELIANCE', 'tcs': 'TCS', 'infosys': 'INFY', 'hdfc': 'HDFC',
            'icici': 'ICICI', 'sbi': 'SBI', 'tata': 'TATAMOTORS', 'tatamotors': 'TATAMOTORS',
            'tata motors': 'TATAMOTORS', 'mahindra': 'M&M', 'bajaj': 'BAJFINANCE',
            'wipro': 'WIPRO', 'bharti': 'BHARTIARTL', 'itc': 'ITC'
        }

        # First try to find company names (including multi-word names)
        potential_symbol = None
        query_clean = query.lower().strip('.,!?')

        # Check for multi-word company names first
        for company_name, symbol in company_tickers.items():
            if company_name in query_clean:
                potential_symbol = symbol
                break

        # If no multi-word match, try individual words
        if not potential_symbol:
            for word in words:
                word_clean = word.lower().strip('.,!?')
                if word_clean in company_tickers:
                    potential_symbol = company_tickers[word_clean]
                    break

        # If no company name found, try to extract ticker symbols
        if not potential_symbol:
            for i, word in enumerate(words):
                if word.lower() in ['of', 'for'] and i + 1 < len(words):
                    next_word = words[i + 1].upper().strip('.,!?')
                    # Skip common words
                    if next_word not in ['THE', 'CURRENT', 'STOCK', 'SHARE', 'PRICE', 'AND']:
                        potential_symbol = next_word
                        break

        if potential_symbol:
            # Try Alpha Vantage first (most accurate, all prices converted to INR)
            if alpha_vantage_service.is_available():
                print(colored(f"🔍 Searching Alpha Vantage for: {potential_symbol}", "cyan"))

                # Check if it's an Indian stock
                indian_stocks = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICI', 'SBI', 'TATAMOTORS', 'WIPRO', 'BHARTIARTL', 'ITC']
                if any(indian_stock in potential_symbol.upper() for indian_stock in indian_stocks):
                    result = alpha_vantage_service.get_indian_stock_quote(potential_symbol)
                else:
                    result = alpha_vantage_service.get_stock_quote(potential_symbol)

                if result["success"]:
                    formatted_response = gemini_service.format_stock_response(result)
                    return strip_markdown(formatted_response)
                else:
                    print(colored(f"⚠️ Alpha Vantage failed: {result['message']}", "yellow"))

            # Fallback to enhanced financial tools
            print(colored(f"🔄 Falling back to enhanced financial tools for: {potential_symbol}", "yellow"))

            # Handle Indian stocks (BSE/NSE)
            if any(indian_stock in potential_symbol for indian_stock in ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICI', 'SBI', 'TATAMOTORS', 'WIPRO', 'BHARTIARTL', 'ITC']):
                result = enhanced_financial_tools.get_indian_stock_price(potential_symbol)
                if result["success"]:
                    formatted_response = gemini_service.format_stock_response(result)
                    return strip_markdown(formatted_response)
                else:
                    return f"❌ {result['message']}\n\nSuggestions:\n" + "\n".join([f"- {s}" for s in result.get('suggestions', [])])

            # Handle global stocks (convert to INR)
            else:
                result = enhanced_financial_tools.get_global_stock_price(potential_symbol)
                if result["success"]:
                    formatted_response = gemini_service.format_stock_response(result)
                    return strip_markdown(formatted_response)
                else:
                    # Try Indian stock as final fallback
                    result = enhanced_financial_tools.get_indian_stock_price(potential_symbol)
                    if result["success"]:
                        formatted_response = gemini_service.format_stock_response(result)
                        return strip_markdown(formatted_response)
                    else:
                        return f"❌ Could not find stock data for '{potential_symbol}'. Please check the symbol or try a different stock.\n\nSuggestions:\n- Verify the stock symbol is correct\n- Try the full company name\n- Check if the company is publicly traded"
    
    # Check for market index queries
    if any(keyword in query_lower for keyword in ['sensex', 'nifty', 'market index', 'market indices']):
        result = enhanced_financial_tools.get_market_indices()
        if result["success"]:
            response = "## 📊 Major Market Indices\n\n"
            for name, data in result["data"].items():
                if data.get("current_price"):
                    change = data.get("change", 0)
                    change_percent = data.get("change_percent", 0)
                    if change > 0:
                        response += f"**{name}:** 🟢 {data['current_price']:,} (+{change_percent:.2f}%)\n"
                    elif change < 0:
                        response += f"**{name}:** 🔴 {data['current_price']:,} ({change_percent:.2f}%)\n"
                    else:
                        response += f"**{name}:** ⚪ {data['current_price']:,} ({change_percent:.2f}%)\n"
            response += f"\n**Last Updated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            return response
        else:
            return f"❌ {result['message']}"
    
    # Check for crypto queries
    if any(keyword in query_lower for keyword in ['bitcoin', 'ethereum', 'crypto', 'cryptocurrency']):
        words = query.split()
        crypto_symbols = {'bitcoin': 'BTC', 'ethereum': 'ETH', 'btc': 'BTC', 'eth': 'ETH'}
        for word in words:
            if word.lower() in crypto_symbols:
                result = enhanced_financial_tools.get_crypto_price(crypto_symbols[word.lower()])
                if result["success"]:
                    return enhanced_financial_tools.format_stock_response(result)
                else:
                    return f"❌ {result['message']}"
    
    return None


# --- Core Processing Function ---
def process_query_flow(
    query: str,
    memory: ConversationBufferMemory,
    deep_search: bool = False,
    stream_callback: Optional[Callable[[str], None]] = None
) -> Dict[str, Any]:
    print(colored(f"\nProcessing Query: '{query}' (Deep Search: {deep_search})", "white", attrs=["bold"]))
    
    # === 0. Financial Query Check ===
    print(colored("Checking if this is a financial query...", "cyan"))
    financial_response = handle_financial_query(query)
    if financial_response:
        print(colored("Financial query detected, returning direct response.", "green"))
        return {"answer": financial_response, "deep_research_log": ""}
    
    final_answer = ""
    rag_context = ""
    web_research_context = ""
    research_debug_log = ""

    # === 1. Small Talk Check (Using BooleanOutputParser) ===
    try:
        print(colored("Checking for small talk...", "cyan"))
        # Use Langchain compatible LLM
        small_talk_llm = main_llm_langchain
        # Updated prompt for BooleanOutputParser (often works better with true/false but tries yes/no)
        small_talk_prompt = PromptTemplate(
            template="Is the following a simple greeting, pleasantry, or conversational filler (small talk)? Answer ONLY with 'YES' or 'NO'.\n\nQuestion: {question}",
            input_variables=["question"]
        )
        # Use BooleanOutputParser
        small_talk_parser = BooleanOutputParser()
        small_talk_chain = small_talk_prompt | small_talk_llm | small_talk_parser

        # Invoke the chain
        is_small_talk = small_talk_chain.invoke({"question": query})
        print(colored(f"Small talk check result: {is_small_talk}", "magenta"))

        if is_small_talk: # BooleanOutputParser returns True or False
            print(colored("Query identified as small talk.", "yellow"))
            # Use Agno compatible LLM for the Agno Agent
            conv_agent = Agent(
                model=main_llm_agno,
                description="You are a friendly assistant.",
                memory=memory
            )
            history = memory.load_memory_variables({})["chat_history"]
            response = conv_agent.run(f"Respond conversationally to: {query}", chat_history=history)
            return {"answer": response.content, "deep_research_log": ""}
    except Exception as e:
        # Catch potential OutputParserException here too
        print(colored(f"Error during small talk check: {e}", "red"))
        if "Invalid" in str(e) or "OutputParserException" in str(e):
             print(colored("Attempting to proceed assuming it's not small talk...", "yellow"))
        else:
             traceback.print_exc() # Print full trace for unexpected errors
        # Proceed assuming it's not small talk on error


    # === 2. RAG Retrieval ===
    retrieved_docs_content = "No documents found or knowledge base unavailable."
    retrieved_docs = None
    if knowledge_base and retriever:
        try:
            print(colored("Attempting RAG retrieval...", "cyan"))
            retrieved_docs = retriever.invoke(query) # Langchain LCEL standard invoke

            if retrieved_docs:
                retrieved_docs_content = "\n\n".join([doc.page_content for doc in retrieved_docs])
                print(colored(f"Retrieved {len(retrieved_docs)} snippets.", "green"))
                print(colored("Retrieved Snippet:", "yellow"))
                print(colored(retrieved_docs_content[:500] + "...", "yellow"))
            else:
                print(colored("No relevant documents found in knowledge base.", "yellow"))
                retrieved_docs_content = "No relevant documents found in knowledge base."
        except Exception as e:
            print(colored(f"Error during RAG retrieval: {e}", "red"))
            traceback.print_exc()
            retrieved_docs_content = "Error retrieving documents from knowledge base."
    else:
        print(colored("Knowledge base not available, skipping RAG.", "yellow"))

    # === 3. Relevance Grading (Using JsonOutputParser with Markdown Fence Instruction) ===
    grade = 0 # Default to not relevant
    if retrieved_docs:
        try:
            print(colored("Grading retrieved documents...", "cyan"))
            grading_llm = main_llm_langchain
            # Updated prompt asking for JSON within markdown fences
            grading_prompt = PromptTemplate(
                 template="""Evaluate the relevance of the retrieved documents to the user's question. Give a binary score: 1 if relevant, 0 if not.\n
                 Provide the score ONLY as JSON within json markdown code fences. Example:
                 json
                 {{
                   "score": 1
                 }}
                 ```

                 Documents:\n{documents}\n\nQuestion: {question}""",
                 input_variables=["documents", "question"]
            )
            # Standard JsonOutputParser - should handle markdown fences
            grading_parser = JsonOutputParser()
            grading_chain = grading_prompt | grading_llm | grading_parser

            grade_result = grading_chain.invoke({"question": query, "documents": retrieved_docs_content})
            # Check the type/content of grade_result
            print(f"DEBUG: Raw grade_result: {grade_result} (type: {type(grade_result)})")
            if isinstance(grade_result, dict):
                 grade = grade_result.get('score', 0) # Default to 0 if key missing
            else:
                 print(colored("Warning: Grading did not return a dictionary.", "yellow"))
                 grade = 0 # Default to not relevant if parsing failed unexpectedly

            print(colored(f"Retrieval grade: {grade} ({'Relevant' if grade == 1 else 'Not Relevant'})", 'magenta'))

            if grade == 1:
                rag_context = retrieved_docs_content
            else:
                print(colored("Documents deemed not relevant or insufficient.", "yellow"))
                rag_context = ""
        except Exception as e:
            print(colored(f"Error during retrieval grading: {e}", "red"))
            # Don't necessarily need full traceback here if it's the expected OutputParserException
            if "Invalid" in str(e) or "OutputParserException" in str(e):
                 print(colored("Failed to parse relevance grade. Assuming documents are not relevant.", "yellow"))
            else:
                 traceback.print_exc() # Show full trace for unexpected errors
            rag_context = "" # Discard context on error


    # === 4. Web Search / Deep Research ===
    # Check for real-time need (Using BooleanOutputParser)
    needs_realtime = True # Default assumption
    try:
        print(colored("Checking for real-time data need...", "cyan"))
        realtime_check_llm = main_llm_langchain
        # Updated prompt for BooleanOutputParser
        realtime_check_prompt = PromptTemplate(
            template="""Does the question below strongly imply a need for CURRENT, up-to-the-minute information like stock prices, breaking news, or live market status? Answer ONLY with 'YES' or 'NO'.\n\nQuestion: {question}""",
            input_variables=["question"]
        )
        realtime_check_parser = BooleanOutputParser()
        realtime_check_chain = realtime_check_prompt | realtime_check_llm | realtime_check_parser

        # BooleanOutputParser returns True/False
        needs_realtime = realtime_check_chain.invoke({"question": query})

        print(colored(f"Needs real-time data check result: {'Yes' if needs_realtime else 'No'}", "cyan"))
    except Exception as e:
        print(colored(f"Error checking for real-time need: {e}", "red"))
        if "Invalid" in str(e) or "OutputParserException" in str(e):
            print(colored("Failed to parse real-time need. Assuming real-time IS needed.", "yellow"))
        else:
            traceback.print_exc()
        needs_realtime = True # Default to True on error

    # Decide whether to perform web step
    perform_web_step = True
    if grade == 1 and not needs_realtime:
        print(colored("Relevant RAG found and no immediate real-time data need identified. Proceeding with web search for verification/augmentation.", "green"))
        # perform_web_step = False # Uncomment to skip web step in this case

    if perform_web_step:
        if deep_search:
            # --- Advanced Deep Research Path ---
            print(colored("Initiating Advanced Deep Research...", 'magenta'))
            if stream_callback: stream_callback("Initiating Advanced Deep Research...\n")
            try:
                # Use the sophisticated deep research system with recursive questioning
                research_result = deep_research_service.research(query, stream_callback=stream_callback)

                if research_result.get("success", False):
                    web_research_context = research_result.get("final_answer", "")
                    research_debug_log = "\n".join(research_result.get("debug_log", []))
                    print(colored("Advanced Deep Research completed successfully.", "green"))
                    if stream_callback: stream_callback("Advanced Deep Research completed successfully.\n")
                else:
                    web_research_context = f"Deep research failed: {research_result.get('error', 'Unknown error')}"
                    research_debug_log = f"Deep research failed: {research_result.get('error', 'Unknown error')}"
                    print(colored("Advanced Deep Research failed.", "red"))
                    if stream_callback: stream_callback("Advanced Deep Research failed.\n")

            except Exception as e:
                error_msg = f"Error during Advanced Deep Research: {e}"
                print(colored(error_msg, "red"))
                traceback.print_exc()
                web_research_context = f"Advanced deep research encountered an error: {str(e)}"
                research_debug_log = f"Advanced deep research error: {str(e)}"
                if stream_callback:
                    stream_callback(f"--- ADVANCED DEEP RESEARCH ERROR: {e} ---\n")
        else:
            # --- Standard Web Search Path (Fallback) ---
            print(colored("Initiating Standard Web Search...", 'magenta'))
            try:
                # Use enhanced web search for standard queries too
                tavily_api_key = os.environ.get("TAVILY_API_KEY")
                search_result = enhanced_web_search.comprehensive_search(query, tavily_api_key)
                
                if search_result["success"]:
                    web_research_context = enhanced_web_search.format_search_results(search_result)
                    print(colored(f"Enhanced Standard Web Search successful using: {', '.join(search_result['sources_used'])}", "green"))
                else:
                    web_research_context = f"Enhanced web search failed: {search_result['message']}"
                    print(colored("Enhanced Standard Web Search failed.", "red"))

            except Exception as e:
                error_msg = f"Error during Enhanced Standard Web Search: {str(e)}"
                print(colored(error_msg, "red"))
                traceback.print_exc()
                web_research_context = f"Enhanced standard web search encountered an error: {str(e)}"

    # === 5. Synthesis ===
    print(colored("Synthesizing final answer...", "cyan"))
    # Use Agno compatible LLM for Agno Agent
    synthesis_agent = Agent(
        model=main_llm_agno,
        description="""You are a Financial Analyst Synthesizer. Combine information from internal knowledge (RAG Context) and web research (Web/Deep Research Context) to answer the user's original query comprehensively. Prioritize accuracy and recent information. Format clearly using plain text only - no markdown formatting.""",
        markdown=False,
    )

    try:
        synthesis_prompt_input = f"""Original Query: {query}

        --- Information from Knowledge Base (RAG Context) ---
        {rag_context if rag_context else "No relevant information found in internal documents."}

        --- Information from Web/Deep Research Context ---
        {web_research_context if web_research_context else "No information gathered from web search or deep research."}

        ---

        **PROMPT:**

        Your only task is to extract four specific data points about a stock and present them. Follow these rules without deviation.

        **1. REQUIRED DATA:**
        * Current or Last Traded Price
        * Previous Day's Closing Price
        * Today's High Price
        * Today's Low Price

        **2. OUTPUT TEMPLATE (MUST BE FOLLOWED EXACTLY):**
        Your entire response must strictly follow this four-line format. Do not add any other text, symbols, or lines.

        Current Price: ₹[Insert Value Here]
        Closing Price: ₹[Insert Value Here]
        Today's High: ₹[Insert Value Here]
        Today's Low: ₹[Insert Value Here]

        **3. CRITICAL RULES:**
        * **No Extra Text:** Do NOT include headers, greetings, analysis, summaries, recommendations, or disclaimers. Your response must begin with "Current Price:" and end with the value for "Today's Low:".
        * **Currency:** All prices MUST be in Indian Rupees (INR), prefixed with the `₹` symbol. If the source data is in USD, convert it using a default rate of **1 USD = ₹83**, unless a different rate is provided in the context.
        * **Formatting:** Use plain text only. Do not use bold, italics, bullet points, or any other special formatting.

        Failure to follow this template will result in an incorrect response.
        """

        print(colored(f"SYNTHESIS PROMPT INPUT LENGTH: {len(synthesis_prompt_input)} chars", "grey"))

        history = memory.load_memory_variables({})["chat_history"]
        final_response = synthesis_agent.run(synthesis_prompt_input, chat_history=history)
        final_answer = final_response.content

        # === 6. Gemini Enhancement and Summarization ===
        if gemini_service.is_available() and final_answer:
            print(colored("Enhancing response with Gemini AI...", "cyan"))
            try:
                # Check if response is too long and needs summarization
                if len(final_answer) > 1500:
                    print(colored("Response is long, summarizing with Gemini...", "yellow"))
                    final_answer = gemini_service.summarize_text(
                        final_answer,
                        max_length=1200,
                        style="detailed"
                    )
                else:
                    # Just enhance formatting
                    final_answer = gemini_service.enhance_financial_response(final_answer)

                print(colored("✅ Response enhanced with Gemini AI", "green"))
            except Exception as e:
                print(colored(f"⚠️ Gemini enhancement failed: {e}", "yellow"))
                # Fallback to basic markdown cleaning
                final_answer = gemini_service.clean_markdown(final_answer)

    except Exception as e:
        print(colored(f"Error during final synthesis: {e}", "red"))
        traceback.print_exc()
        final_answer = f"Sorry, I encountered an error while synthesizing the final answer: {str(e)}"

    # Strip any remaining markdown formatting from final answer
    final_answer = strip_markdown(final_answer)

    print(colored("Processing complete.", "white", attrs=["bold"]))

    return {
        "answer": final_answer,
        "deep_research_log": research_debug_log
        }

# Remove the entire testing block below
# Remove the entire testing block below
# Example of how to potentially run this file directly (for testing)
# if __name__ == "__main__":
#     print("Testing process_query_flow...")
#     # test_query = "Is Nio stock a good investment right now?"
#     # test_query = "What is the weather in London?" # Test small talk / tool use
#     test_query = "give me the stock list with date to invest and tell me the year" # Test grading failure

#     # Create a dummy memory for testing
#     test_memory = ConversationBufferMemory(return_messages=True, memory_key="chat_history")

#     print("\n--- Testing Standard Search ---")
#     result_standard = process_query_flow(test_query, test_memory, deep_search=False)
#     print("\nStandard Search Final Answer:")
#     console.print(Markdown(result_standard["answer"]))
#     print("-" * 30)
#
#     print("\n--- Testing Deep Research (will log to console) ---")
#     result_deep = process_query_flow(test_query, test_memory, deep_search=True)
#     print("\nDeep Research Final Answer:")
#     console.print(Markdown(result_deep["answer"]))
#     print("\nDeep Research Debug Log (excerpt):")
#     print(result_deep.get("deep_research_log", "No log returned")[:1000] + "...") # Safely get log
#     print("-" * 30)


# --- Pydantic Model for Request Body ---
class QueryRequest(BaseModel):
    query: str
    deep_search: bool = False # Default to False if not provided

# --- FastAPI App Setup ---
app = FastAPI(
    title="Financial Assistant API",
    description="API endpoint for the AI Financial Assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:8000",
        "http://localhost:19006",  # Expo web
        "http://localhost:19000",  # Expo dev server
        "exp://localhost:19000",   # Expo Go app
        "exp://192.168.21.247:19000",  # Expo Go on mobile (replace with your IP)
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory storage for conversation memory ---
# For production, consider a more robust session management solution
conversation_memory_store = {}

def get_or_create_memory(session_id: str = "default_session") -> ConversationBufferMemory:
    """Gets or creates a memory buffer for a session."""
    if session_id not in conversation_memory_store:
        conversation_memory_store[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True # Important for Langchain chains expecting message objects
        )
    return conversation_memory_store[session_id]

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    """Health check endpoint for connection testing"""
    return {"status": "healthy", "message": "WealthLens Backend is running"}

@app.get("/test-markdown")
async def test_markdown():
    """Test endpoint to show proper markdown formatting"""
    sample_markdown = """# WealthLens Markdown Test

## 📊 Stock Analysis Example

### 🟢 Key Metrics
• **Current Price:** 💰 $150.25
• **Change:** 📈 +2.5% (+$3.75)
• **Volume:** 1,234,567 shares
• **Market Cap:** $2.5B

### 📈 Analysis Summary
The stock shows **strong performance** with positive momentum. Key factors include:

• Strong quarterly earnings 💪
• Positive analyst sentiment 👍
• Growing market share 📊

### ⚠️ Risk Factors
• Market volatility concerns
• Regulatory challenges
• Competition pressure

### 💡 Recommendation
**BUY** - Strong fundamentals support continued growth potential.

---
*This is a test of markdown formatting capabilities.*"""

    return {"markdown": sample_markdown, "formatted": True}

@app.get("/live-opportunities")
async def get_live_opportunities(limit: int = 10):
    """Get live investment opportunities with real-time prices"""
    try:
        print(colored("🔥 Fetching live investment opportunities...", "blue"))
        opportunities = live_opportunities_service.get_trending_stocks(limit)

        return {
            "success": True,
            "data": opportunities,
            "count": len(opportunities),
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        print(colored(f"❌ Error fetching live opportunities: {e}", "red"))
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@app.get("/market-movers")
async def get_market_movers():
    """Get market gainers and losers"""
    try:
        print(colored("📈📉 Fetching market movers...", "blue"))
        movers = live_opportunities_service.get_market_movers()

        return {
            "success": True,
            "data": movers
        }
    except Exception as e:
        print(colored(f"❌ Error fetching market movers: {e}", "red"))
        return {
            "success": False,
            "error": str(e),
            "data": {"gainers": [], "losers": []}
        }

@app.get("/search-stocks")
async def search_stocks(q: str, limit: int = 10):
    """Search for stocks by symbol or name"""
    try:
        print(colored(f"🔍 Searching stocks for: {q}", "blue"))
        results = live_opportunities_service.search_stocks(q, limit)

        return {
            "success": True,
            "data": results,
            "query": q,
            "count": len(results)
        }
    except Exception as e:
        print(colored(f"❌ Error searching stocks: {e}", "red"))
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@app.get("/stock/{symbol}")
async def get_stock_details(symbol: str):
    """Get detailed information for a specific stock"""
    try:
        print(colored(f"📊 Fetching details for {symbol}...", "blue"))
        stock_data = live_opportunities_service.get_stock_data(symbol.upper())

        return {
            "success": True,
            "data": stock_data
        }
    except Exception as e:
        print(colored(f"❌ Error fetching stock details: {e}", "red"))
        return {
            "success": False,
            "error": str(e),
            "data": None
        }

# --- API Endpoint ---
@app.post("/query")
async def handle_query(request: QueryRequest):
    """
    Handles user queries, processes them through the agent flow,
    and returns the AI's response.
    """
    try:
        # Get or create memory for this session
        memory = get_or_create_memory()
        
        # Process the query
        response = process_query_flow(
            query=request.query,
            memory=memory,
            deep_search=request.deep_search,
            stream_callback=None  # No streaming for API calls
        )
        
        # Fix emoji encoding issues if response is a string
        if isinstance(response, str):
            response = response.encode('utf-8').decode('utf-8')
        elif isinstance(response, dict) and 'answer' in response:
            if isinstance(response['answer'], str):
                response['answer'] = response['answer'].encode('utf-8').decode('utf-8')

        return {"answer": {"answer": response, "deep_research_log": ""}}
        
    except Exception as e:
        error_msg = f"Error processing query: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

# --- Backend API Only (Frontend runs separately) ---
# Static file serving removed - Frontend and Backend run independently

# --- Main Execution Block (for running with uvicorn) ---
# Keep this block if you want to run the server using 'python run.py'
if __name__ == "__main__":
    import uvicorn
    print(colored("Starting FastAPI server...", "cyan"))
    # Ensure the app object used here is the FastAPI instance 'app'
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True) # Use reload for development