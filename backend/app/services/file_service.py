"""File processing service for extracting text from PDF, EPUB, and TXT files."""

import io
import re
from typing import BinaryIO


def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from a TXT file."""
    try:
        return file_content.decode("utf-8")
    except UnicodeDecodeError:
        # Try with different encoding
        return file_content.decode("latin-1")


def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from a PDF file."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {e}")


def extract_text_from_epub(file_content: bytes) -> str:
    """Extract text from an EPUB file."""
    try:
        import zipfile
        from xml.etree import ElementTree as ET
        
        text_parts = []
        with zipfile.ZipFile(io.BytesIO(file_content)) as zf:
            # Find HTML/XHTML files in the EPUB
            for name in zf.namelist():
                if name.endswith(('.html', '.xhtml', '.htm')):
                    content = zf.read(name)
                    try:
                        # Parse HTML and extract text
                        root = ET.fromstring(content)
                        # Remove script and style elements
                        for elem in root.iter():
                            if elem.tag in ('script', 'style'):
                                elem.clear()
                        # Get text content
                        text = ET.tostring(root, encoding='unicode', method='text')
                        text_parts.append(text)
                    except:
                        # If XML parsing fails, try simple HTML tag stripping
                        text = re.sub(r'<[^>]+>', '', content.decode('utf-8', errors='ignore'))
                        text_parts.append(text)
        
        return "\n\n".join(text_parts)
    except Exception as e:
        raise ValueError(f"Failed to extract EPUB text: {e}")


def detect_file_type(filename: str) -> str:
    """Detect file type from filename extension."""
    filename_lower = filename.lower()
    if filename_lower.endswith('.pdf'):
        return 'pdf'
    elif filename_lower.endswith('.epub'):
        return 'epub'
    elif filename_lower.endswith('.txt'):
        return 'txt'
    else:
        raise ValueError(f"Unsupported file type: {filename}")


def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from a file based on its type."""
    file_type = detect_file_type(filename)
    
    if file_type == 'pdf':
        return extract_text_from_pdf(file_content)
    elif file_type == 'epub':
        return extract_text_from_epub(file_content)
    elif file_type == 'txt':
        return extract_text_from_txt(file_content)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")


def analyze_book_content(text: str) -> dict:
    """Analyze book content and extract structure."""
    # Simple chapter detection based on common patterns
    chapter_patterns = [
        r'(?:Chapter|CHAPTER)\s+(\d+|[IVX]+)[:\s]*([^\n]+)?',
        r'^(\d+)\.\s+([^\n]+)$',  # "1. Chapter Title"
        r'^#{1,2}\s+([^\n]+)$',    # Markdown headers
    ]
    
    chapters = []
    lines = text.split('\n')
    current_chapter = None
    chapter_content = []
    chapter_num = 0
    
    for line in lines:
        found_chapter = False
        
        for pattern in chapter_patterns:
            match = re.match(pattern, line.strip())
            if match:
                # Save previous chapter
                if current_chapter:
                    current_chapter["content"] = '\n\n'.join(chapter_content)
                    chapters.append(current_chapter)
                
                # Start new chapter
                chapter_num += 1
                if len(match.groups()) > 1:
                    title = match.group(2).strip() if match.group(2) else f"Chapter {chapter_num}"
                else:
                    title = match.group(1).strip()
                
                current_chapter = {
                    "id": f"chapter-{chapter_num}",
                    "number": chapter_num,
                    "title": title,
                    "content": "",
                    "keyPoints": [],
                    "concepts": []
                }
                chapter_content = []
                found_chapter = True
                break
        
        if not found_chapter and current_chapter:
            chapter_content.append(line)
    
    # Save last chapter
    if current_chapter:
        current_chapter["content"] = '\n\n'.join(chapter_content)
        chapters.append(current_chapter)
    
    # If no chapters found, treat entire text as one chapter
    if not chapters:
        chapters = [{
            "id": "chapter-1",
            "number": 1,
            "title": "Full Text",
            "content": text,
            "keyPoints": [],
            "concepts": []
        }]
    
    # Extract concepts (capitalized phrases)
    concept_pattern = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b'
    matches = re.findall(concept_pattern, text)
    concept_counts = {}
    for match in matches:
        if len(match) > 3 and match not in ['The', 'This', 'That', 'These', 'Those', 'Chapter']:
            concept_counts[match] = concept_counts.get(match, 0) + 1
    
    # Get top concepts
    concepts = [
        {
            "id": f"concept-{i+1}",
            "name": name,
            "description": f"A key concept mentioned {count} times throughout the book.",
            "occurrences": count
        }
        for i, (name, count) in enumerate(
            sorted(concept_counts.items(), key=lambda x: x[1], reverse=True)[:15]
        )
    ]
    
    return {
        "chapters": chapters,
        "concepts": concepts,
        "totalPages": max(1, len(text) // 3000)
    }
