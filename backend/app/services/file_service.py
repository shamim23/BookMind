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
    lines = text.split('\n')
    chapters = []
    current_chapter = None
    chapter_content = []
    chapter_num = 0
    intro_content = []  # Content before first numbered chapter
    found_first_numbered_chapter = False
    
    for line in lines:
        found_chapter = False
        line_stripped = line.strip()
        
        # Look for explicit "Chapter X" patterns (with or without markdown)
        # Handle: "Chapter 1: Title", "## Chapter 1: Title", "# Chapter 1"
        chapter_match = re.match(r'(?:Chapter|CHAPTER)\s+(\d+|[IVX]+)[:\s]*([^\n]+)?', line_stripped)
        if not chapter_match:
            # Try with markdown prefix
            chapter_match = re.match(r'^#+\s+(?:Chapter|CHAPTER)\s+(\d+|[IVX]+)[:\s]*([^\n]+)?', line_stripped)
        
        if chapter_match:
            # This is a numbered chapter (e.g., "Chapter 1")
            found_first_numbered_chapter = True
            
            # Save any intro content as Chapter 1 before the first numbered chapter
            if intro_content and not chapters and not current_chapter:
                chapter_num += 1
                chapters.append({
                    "id": f"chapter-{chapter_num}",
                    "number": chapter_num,
                    "title": "Introduction",
                    "content": '\n\n'.join(intro_content).strip(),
                    "keyPoints": [],
                    "concepts": []
                })
                intro_content = []
            # Or save previous chapter if exists
            elif current_chapter:
                current_chapter["content"] = '\n\n'.join(chapter_content).strip()
                chapters.append(current_chapter)
            
            # Start new numbered chapter
            chapter_num += 1
            title = chapter_match.group(2).strip() if chapter_match.group(2) else f"Chapter {chapter_match.group(1)}"
            
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
        
        # Collect content
        if not found_chapter:
            if current_chapter:
                chapter_content.append(line)
            else:
                intro_content.append(line)
    
    # Save last chapter
    if current_chapter:
        current_chapter["content"] = '\n\n'.join(chapter_content).strip()
        chapters.append(current_chapter)
    
    # If we have intro content but no chapters, create a single chapter
    if intro_content and not chapters:
        chapter_num += 1
        chapters.append({
            "id": f"chapter-{chapter_num}",
            "number": chapter_num,
            "title": "Full Text",
            "content": '\n\n'.join(intro_content).strip(),
            "keyPoints": [],
            "concepts": []
        })
    
    # If still no chapters, treat entire text as one chapter
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
