import json
import os
from pathlib import Path
from typing import List

from langchain.embeddings.base import Embeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from sentence_transformers import SentenceTransformer


class SentenceTransformerEmbeddings(Embeddings):
    """Custom LangChain Embeddings wrapper for SentenceTransformers"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of documents"""
        embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query"""
        embedding = self.model.encode([text])
        return embedding[0].tolist()

def load_json_files(data_directory: str) -> List[Document]:
    """Load all JSON files from the data directory and convert to LangChain Documents"""
    documents = []
    data_path = Path(data_directory)
    
    if not data_path.exists():
        print(f" Directory {data_directory} does not exist!")
        return documents
    
    json_files = list(data_path.glob("*.json"))
    print(f" Found {len(json_files)} JSON files")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Process based on JSON structure
            if isinstance(data, list):
                # If JSON contains a list of verses
                for item in data:
                    doc = process_verse_item(item, json_file.name)
                    if doc:
                        documents.append(doc)
            elif isinstance(data, dict):
                # If JSON contains verses in 'verses' key
                if 'verses' in data:
                    chapter_num = extract_chapter_from_filename(json_file.name)
                    for verse in data['verses']:
                        verse['chapter_number'] = chapter_num  # Add chapter info
                        doc = process_verse_item(verse, json_file.name)
                        if doc:
                            documents.append(doc)
                else:
                    # Single document
                    doc = process_chapter_data(data, json_file.name)
                    if doc:
                        documents.append(doc)
                    
        except Exception as e:
            print(f" Error processing {json_file}: {e}")
    
    print(f" Processed {len(documents)} documents")
    return documents

def extract_chapter_from_filename(filename: str) -> str:
    """Extract chapter number from filename like 'chapter-1.json'"""
    try:
        if 'chapter-' in filename:
            return filename.split('chapter-')[1].split('.')[0]
    except:
        pass
    return 'Unknown'

def process_verse_item(item: dict, filename: str) -> Document:
    """Process individual verse item from JSON"""
    try:
        # Extract chapter number
        chapter = item.get('chapter_number', item.get('chapter', 'Unknown'))
        
        # If chapter is still Unknown, extract from filename
        if chapter == 'Unknown':
            chapter = extract_chapter_from_filename(filename)
        
        # Extract verse number - try different field names
        verse_number = (item.get('verse_number') or 
                       item.get('verse') or 
                       item.get('id') or 
                       item.get('text_number') or 'Unknown')
        
        # Create comprehensive text content
        content_parts = []
        
        # Sanskrit text
        if 'text' in item and item['text']:
            content_parts.append(f"Sanskrit: {item['text']}")
        
        # Translation
        if 'translation' in item and item['translation']:
            content_parts.append(f"Translation: {item['translation']}")
        
        # Purport/Commentary
        if 'purport' in item and item['purport']:
            content_parts.append(f"Purport: {item['purport']}")
        
        # Word meanings
        if 'word_meanings' in item and item['word_meanings']:
            content_parts.append(f"Word Meanings: {item['word_meanings']}")
        
        content = "\n\n".join(content_parts)
        
        if not content.strip():
            return None
        
        # Metadata for citations
        metadata = {
            'source': filename,
            'chapter': str(chapter),
            'verse': str(verse_number),
            'verse_id': f"BG {chapter}.{verse_number}",
            'type': 'verse'
        }
        
        return Document(page_content=content, metadata=metadata)
        
    except Exception as e:
        print(f" Error processing verse: {e}")
        return None

def process_chapter_data(data: dict, filename: str) -> Document:
    """Process chapter-level data from JSON"""
    try:
        content_parts = []
        chapter_num = extract_chapter_from_filename(filename)
        
        if chapter_num != 'Unknown':
            content_parts.append(f"Chapter {chapter_num}")
        
        if 'name' in data and data['name']:
            content_parts.append(f"Name: {data['name']}")
        
        if 'summary' in data and data['summary']:
            content_parts.append(f"Summary: {data['summary']}")
        
        content = "\n\n".join(content_parts)
        
        if not content.strip():
            return None
        
        metadata = {
            'source': filename,
            'chapter': str(chapter_num),
            'type': 'chapter_info'
        }
        
        return Document(page_content=content, metadata=metadata)
        
    except Exception as e:
        print(f" Error processing chapter: {e}")
        return None

def create_faiss_vectorstore(data_directory: str, output_directory: str):
    """Create FAISS vectorstore from JSON files"""
    
    # Create output directory
    os.makedirs(output_directory, exist_ok=True)
    
    print(" Loading documents from JSON files...")
    documents = load_json_files(data_directory)
    
    if not documents:
        print(" No documents found to process!")
        return None
    
    print(" Initializing SentenceTransformer embeddings...")
    embeddings = SentenceTransformerEmbeddings('all-MiniLM-L6-v2')
    
    print(" Creating FAISS vectorstore...")
    vectorstore = FAISS.from_documents(documents, embeddings)
    
    print(" Saving FAISS vectorstore...")
    vectorstore.save_local(output_directory, index_name="index")
    
    print(f"FAISS vectorstore created successfully!")
    print(f"Location: {output_directory}")
    print(f"Total documents: {len(documents)}")
    print(f"Vector dimension: {embeddings.model.get_sentence_embedding_dimension()}")
    
    return vectorstore

if __name__ == "__main__":
    print("Creating Bhagavad Gita FAISS Vectorstore...")
    
    DATA_DIR = "/home/feather/geetaGpt/Backend/data/bhagavad-gita-as-it-is/json"
    OUTPUT_DIR = "/home/feather/geetaGpt/Backend/vectorstore/db_faiss"
    
    vectorstore = create_faiss_vectorstore(DATA_DIR, OUTPUT_DIR)
    
    if vectorstore:
        print("\n🧪 Testing vectorstore...")
        test_query = "What is dharma?"
        results = vectorstore.similarity_search(test_query, k=3)
        
        print(f"Query: {test_query}")
        for i, doc in enumerate(results):
            print(f"\nResult {i+1}:")
            print(f"Content: {doc.page_content[:200]}...")
            print(f"Metadata: {doc.metadata}")
        
        print("\n✅ Vectorstore creation complete!")
