"""Router for book-related endpoints."""

from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List

from app.models.schemas import Book, SampleBook
from app.data import get_all_sample_books, get_sample_book, CATEGORIES
from app.services.file_service import extract_text_from_file, analyze_book_content

router = APIRouter(prefix="/books", tags=["books"])


@router.get("/sample", response_model=List[SampleBook])
async def get_sample_books():
    """Get all sample books."""
    return get_all_sample_books()


@router.get("/sample/{book_id}", response_model=SampleBook)
async def get_sample_book_by_id(book_id: str):
    """Get a specific sample book by ID."""
    book = get_sample_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.get("/categories")
async def get_categories():
    """Get all book categories."""
    return CATEGORIES


@router.post("/upload", response_model=Book)
async def upload_book(file: UploadFile = File(...)):
    """Upload and process a book file (PDF, EPUB, or TXT)."""
    try:
        # Read file content
        content = await file.read()
        
        # Extract text
        text = extract_text_from_file(content, file.filename)
        
        if len(text) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from file")
        
        # Analyze content
        analysis = analyze_book_content(text)
        
        # Create book object
        book = Book(
            id=f"book-{hash(file.filename) % 10000000}",
            title=file.filename.rsplit('.', 1)[0],
            content=text,
            chapters=analysis["chapters"],
            concepts=analysis["concepts"],
            totalPages=analysis["totalPages"]
        )
        
        return book
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
