import os
import yfinance as yf
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain import hub

# -------------------
# CONFIG
# -------------------
PDF_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
INDEX_FOLDER = "faiss_index_pdfs"
EMBED_MODEL = "all-minilm"
LLM_MODEL = "llama3.2"
STEPS_TAKEN = []


def log_step(step_num, description, status="âœ…", preview=None):
    STEPS_TAKEN.append({
        "Step": step_num,
        "Description": description,
        "Status": status,
        "Preview": preview if preview else ""
    })


# -------------------
# PDF INDEXING
# -------------------
def build_index():
    if not os.path.exists(PDF_FOLDER):
        raise FileNotFoundError(f"âŒ PDF folder not found at {PDF_FOLDER}")

    print(f"ðŸ“‚ Loading PDFs from: {PDF_FOLDER}")
    docs = []

    # Load all PDFs in the folder
    for file in os.listdir(PDF_FOLDER):
        if file.endswith(".pdf"):
            loader = PyMuPDFLoader(os.path.join(PDF_FOLDER, file))
            raw_docs = loader.load()
            docs.extend(raw_docs)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    split_docs = text_splitter.split_documents(docs)
    log_step(1, f"Loaded and split {len(docs)} docs into {len(split_docs)} chunks", preview=str(split_docs[0])[:100])

    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    vector_store = FAISS.from_documents(split_docs, embedding=embeddings)
    vector_store.save_local(INDEX_FOLDER)
    log_step(2, f"Saved FAISS index to '{INDEX_FOLDER}'")


# -------------------
# LOAD INDEX
# -------------------
def load_index():
    index_path = os.path.join(INDEX_FOLDER, "index.faiss")
    if not os.path.exists(index_path):
        raise FileNotFoundError(f"âŒ FAISS index not found at {index_path}. Run build_index() first.")
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    log_step(3, "Loaded FAISS index with Ollama embeddings")
    return FAISS.load_local(INDEX_FOLDER, embeddings=embeddings, allow_dangerous_deserialization=True)


# -------------------
# RETRIEVAL CHAIN
# -------------------
def make_retrieval_chain(vector_store):
    retrieval_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    combine_chain = create_stuff_documents_chain(
        OllamaLLM(model=LLM_MODEL),
        retrieval_prompt
    )
    return create_retrieval_chain(vector_store.as_retriever(), combine_chain)


# -------------------
# QUERY PDF KNOWLEDGE BASE
# -------------------
def query_index(query: str):
    try:
        vector_store = load_index()
    except FileNotFoundError:
        print("âš ï¸ Index missing. Building now...")
        build_index()
        vector_store = load_index()

    retrieval_chain = make_retrieval_chain(vector_store)
    result = retrieval_chain.invoke({"input": query})
    log_step(4, "Ran query against retriever", preview=query)
    return result["answer"]


# -------------------
# FINANCIAL DATA QUERY (YFinance)
# -------------------
def query_stock(ticker: str, period="1mo"):
    stock = yf.Ticker(ticker)
    hist = stock.history(period=period)
    if hist.empty:
        return f"âš ï¸ No data found for {ticker}"
    log_step(5, f"Fetched stock data for {ticker}", preview=hist.tail(3).to_string())
    return hist.tail(5).to_string()


# -------------------
# MAIN
# -------------------
if __name__ == "__main__":
    print("=== RAG Pipeline for PDFs + YFinance ===")

    # Example PDF query
    answer = query_index("Who owns 90% of all corporate shares of stock in America, according to a recent article in The Wall Street Journal?")
    print("\nðŸ“Œ Query Result (PDFs):\n", answer)

    # Example stock query
    stock_info = query_stock("RTX", period="5d")
    print("\nðŸ’¹ Stock Data (RTX):\n", stock_info)

    print("\nðŸ§¾ Steps Taken:\n", STEPS_TAKEN)
