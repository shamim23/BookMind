"""Router for book-related endpoints."""

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.schemas import Book, SampleBook
from app.data import get_all_sample_books, get_sample_book, CATEGORIES
from app.services.file_service import extract_text_from_file, analyze_book_content
from app.db import get_db
from app.db import crud

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
async def upload_book(file: UploadFile = File(...), db: Session = Depends(get_db)):
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
        
        # Save to database
        db_book = crud.get_or_create_book(
            db=db,
            title=file.filename.rsplit('.', 1)[0],
            content=text,
            category="Uploaded"
        )
        
        # Create chapters in database
        for chapter_data in analysis["chapters"]:
            crud.get_or_create_chapter(
                db=db,
                book_id=db_book.id,
                number=chapter_data["number"],
                title=chapter_data["title"],
                content=chapter_data.get("content"),
                summary=chapter_data.get("summary"),
                key_points=chapter_data.get("keyPoints", [])
            )
        
        # Refresh to get chapters
        db_book = crud.get_book(db, db_book.id)
        
        # Convert to Pydantic model
        return Book(
            id=db_book.id,
            title=db_book.title,
            author=db_book.author,
            content=db_book.content or text,
            chapters=analysis["chapters"],
            concepts=analysis["concepts"],
            totalPages=analysis["totalPages"],
            category=db_book.category or "Uploaded"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")


@router.get("/{book_id}", response_model=Book)
async def get_book(book_id: str, db: Session = Depends(get_db)):
    """Get a book by ID from database."""
    db_book = crud.get_book(db, book_id)
    if not db_book:
        # Try sample books
        sample = get_sample_book(book_id)
        if sample:
            return Book(
                id=sample["id"],
                title=sample["title"],
                author=sample["author"],
                content=sample["content"],
                chapters=[],  # Will need to parse sample books
                concepts=[],
                category=sample["category"]
            )
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Get chapters
    chapters = crud.get_chapters_by_book(db, book_id)
    
    return Book(
        id=db_book.id,
        title=db_book.title,
        author=db_book.author,
        content=db_book.content or "",
        chapters=[
            {
                "id": c.id,
                "number": c.number,
                "title": c.title,
                "content": c.content or "",
                "summary": c.summary,
                "keyPoints": c.key_points or [],
                "startIndex": 0,
                "endIndex": 0,
                "concepts": []
            }
            for c in chapters
        ],
        concepts=[],
        category=db_book.category
    )


@router.post("/sample/sync/{sample_id}")
async def sync_sample_book(sample_id: str, db: Session = Depends(get_db)):
    """Sync a sample book to the database with its chapters."""
    sample = get_sample_book(sample_id)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample book not found")
    
    # Create or get book
    db_book = crud.get_or_create_book(
        db=db,
        title=sample["title"],
        author=sample["author"],
        sample_id=sample_id,
        category=sample["category"],
        description=sample.get("description"),
        content=sample["content"]
    )
    
    # Analyze content to get chapters
    analysis = analyze_book_content(sample["content"])
    
    # Create chapters
    created_chapters = []
    for chapter_data in analysis["chapters"]:
        chapter = crud.get_or_create_chapter(
            db=db,
            book_id=db_book.id,
            number=chapter_data["number"],
            title=chapter_data["title"],
            content=chapter_data.get("content"),
            summary=chapter_data.get("summary"),
            key_points=chapter_data.get("keyPoints", [])
        )
        created_chapters.append(chapter)
    
    return {
        "message": f"Synced book '{db_book.title}' with {len(created_chapters)} chapters",
        "book_id": db_book.id,
        "chapters_count": len(created_chapters)
    }


@router.get("/{book_id}/chapters")
async def get_book_chapters(book_id: str, db: Session = Depends(get_db)):
    """Get all chapters for a book."""
    chapters = crud.get_chapters_by_book(db, book_id)
    return [
        {
            "id": c.id,
            "number": c.number,
            "title": c.title,
            "content": c.content,
            "summary": c.summary,
            "word_count": c.word_count,
            "key_points": c.key_points or []
        }
        for c in chapters
    ]
