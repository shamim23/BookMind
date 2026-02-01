"""CRUD operations for database models."""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.models import Book, Chapter, Insight, UserBook, Note


# ==================== Book CRUD ====================

def get_book(db: Session, book_id: str) -> Optional[Book]:
    """Get a book by ID."""
    return db.query(Book).filter(Book.id == book_id).first()


def get_book_by_sample_id(db: Session, sample_id: str) -> Optional[Book]:
    """Get a book by its sample book ID."""
    return db.query(Book).filter(Book.sample_id == sample_id).first()


def get_or_create_book(
    db: Session,
    title: str,
    author: Optional[str] = None,
    sample_id: Optional[str] = None,
    category: Optional[str] = None,
    description: Optional[str] = None,
    content: Optional[str] = None
) -> Book:
    """Get existing book or create new one."""
    # Check if book exists by sample_id
    if sample_id:
        existing = get_book_by_sample_id(db, sample_id)
        if existing:
            return existing
    
    # Create new book
    book = Book(
        title=title,
        author=author,
        sample_id=sample_id,
        category=category,
        description=description,
        content=content
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


def update_book(db: Session, book_id: str, **kwargs) -> Optional[Book]:
    """Update book fields."""
    book = get_book(db, book_id)
    if not book:
        return None
    
    for key, value in kwargs.items():
        if hasattr(book, key):
            setattr(book, key, value)
    
    db.commit()
    db.refresh(book)
    return book


# ==================== Chapter CRUD ====================

def get_chapter(db: Session, chapter_id: str) -> Optional[Chapter]:
    """Get a chapter by ID."""
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()


def get_chapter_by_number(db: Session, book_id: str, chapter_number: int) -> Optional[Chapter]:
    """Get a chapter by book ID and chapter number."""
    return db.query(Chapter).filter(
        Chapter.book_id == book_id,
        Chapter.number == chapter_number
    ).first()


def get_or_create_chapter(
    db: Session,
    book_id: str,
    number: int,
    title: str,
    content: Optional[str] = None,
    summary: Optional[str] = None,
    key_points: Optional[List[str]] = None
) -> Chapter:
    """Get existing chapter or create new one."""
    existing = get_chapter_by_number(db, book_id, number)
    if existing:
        # Update if content changed
        if content and existing.content != content:
            existing.content = content
            existing.summary = summary or existing.summary
            existing.key_points = key_points or existing.key_points
            db.commit()
            db.refresh(existing)
        return existing
    
    # Create new chapter
    chapter = Chapter(
        book_id=book_id,
        number=number,
        title=title,
        content=content,
        summary=summary,
        key_points=key_points or [],
        word_count=len(content.split()) if content else 0
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


def get_chapters_by_book(db: Session, book_id: str) -> List[Chapter]:
    """Get all chapters for a book, ordered by number."""
    return db.query(Chapter).filter(
        Chapter.book_id == book_id
    ).order_by(Chapter.number).all()


# ==================== Insight CRUD ====================

def get_insight(db: Session, insight_id: str) -> Optional[Insight]:
    """Get an insight by ID."""
    return db.query(Insight).filter(Insight.id == insight_id).first()


def get_insights_by_chapter(db: Session, chapter_id: str) -> List[Insight]:
    """Get all insights for a chapter."""
    return db.query(Insight).filter(
        Insight.chapter_id == chapter_id
    ).order_by(desc(Insight.created_at)).all()


def get_insights_by_book(db: Session, book_id: str, limit: int = 100) -> List[Insight]:
    """Get all insights for a book."""
    return db.query(Insight).filter(
        Insight.book_id == book_id
    ).order_by(desc(Insight.created_at)).limit(limit).all()


def create_insight(
    db: Session,
    book_id: str,
    chapter_id: str,
    title: str,
    summary: str,
    evidence: str,
    implication: str,
    insight_type: str = "pattern",
    ai_model: Optional[str] = None
) -> Insight:
    """Create a new insight."""
    insight = Insight(
        book_id=book_id,
        chapter_id=chapter_id,
        title=title,
        summary=summary,
        evidence=evidence,
        implication=implication,
        insight_type=insight_type,
        ai_model=ai_model,
        is_ai_generated=1
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight


def create_insights_batch(
    db: Session,
    book_id: str,
    chapter_id: str,
    insights_data: List[Dict[str, Any]],
    ai_model: Optional[str] = None
) -> List[Insight]:
    """Create multiple insights at once."""
    insights = []
    for data in insights_data:
        insight = Insight(
            book_id=book_id,
            chapter_id=chapter_id,
            title=data.get("title", ""),
            summary=data.get("summary", ""),
            evidence=data.get("evidence", ""),
            implication=data.get("implication", ""),
            insight_type=data.get("insight_type", "pattern"),
            ai_model=ai_model,
            is_ai_generated=1
        )
        db.add(insight)
        insights.append(insight)
    
    db.commit()
    for insight in insights:
        db.refresh(insight)
    return insights


def update_insight(
    db: Session,
    insight_id: str,
    **kwargs
) -> Optional[Insight]:
    """Update an insight."""
    insight = get_insight(db, insight_id)
    if not insight:
        return None
    
    for key, value in kwargs.items():
        if hasattr(insight, key):
            setattr(insight, key, value)
    
    insight.is_ai_generated = 0  # Mark as user-modified
    db.commit()
    db.refresh(insight)
    return insight


def delete_insight(db: Session, insight_id: str) -> bool:
    """Delete an insight."""
    insight = get_insight(db, insight_id)
    if not insight:
        return False
    
    db.delete(insight)
    db.commit()
    return True


def delete_insights_by_chapter(db: Session, chapter_id: str) -> int:
    """Delete all insights for a chapter. Returns count deleted."""
    count = db.query(Insight).filter(Insight.chapter_id == chapter_id).delete()
    db.commit()
    return count


def has_insights_for_chapter(db: Session, chapter_id: str) -> bool:
    """Check if chapter has any saved insights."""
    return db.query(Insight).filter(Insight.chapter_id == chapter_id).first() is not None


# ==================== UserBook CRUD ====================

def get_user_book(db: Session, user_id: str, book_id: str) -> Optional[UserBook]:
    """Get a user's book record."""
    return db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.book_id == book_id
    ).first()


def create_or_update_user_book(
    db: Session,
    user_id: str,
    book_id: str,
    current_chapter: Optional[int] = None,
    progress_percent: Optional[int] = None,
    is_completed: Optional[bool] = None
) -> UserBook:
    """Create or update user book progress."""
    user_book = get_user_book(db, user_id, book_id)
    
    if user_book:
        if current_chapter is not None:
            user_book.current_chapter = current_chapter
        if progress_percent is not None:
            user_book.progress_percent = progress_percent
        if is_completed is not None:
            user_book.is_completed = 1 if is_completed else 0
            if is_completed:
                from sqlalchemy.sql import func
                user_book.completed_at = func.now()
        db.commit()
        db.refresh(user_book)
        return user_book
    
    # Create new
    user_book = UserBook(
        user_id=user_id,
        book_id=book_id,
        current_chapter=current_chapter or 1,
        progress_percent=progress_percent or 0,
        is_completed=1 if is_completed else 0
    )
    db.add(user_book)
    db.commit()
    db.refresh(user_book)
    return user_book


def get_user_books(db: Session, user_id: str) -> List[UserBook]:
    """Get all books for a user."""
    return db.query(UserBook).filter(
        UserBook.user_id == user_id
    ).order_by(desc(UserBook.last_read_at)).all()


# ==================== Note CRUD ====================

def create_note(
    db: Session,
    user_id: str,
    book_id: str,
    chapter_id: str,
    content: str,
    highlight_text: Optional[str] = None,
    note_type: str = "note",
    start_index: Optional[int] = None,
    end_index: Optional[int] = None
) -> Note:
    """Create a new note."""
    note = Note(
        user_id=user_id,
        book_id=book_id,
        chapter_id=chapter_id,
        content=content,
        highlight_text=highlight_text,
        note_type=note_type,
        start_index=start_index,
        end_index=end_index
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_notes_by_chapter(db: Session, user_id: str, chapter_id: str) -> List[Note]:
    """Get all notes for a chapter."""
    return db.query(Note).filter(
        Note.user_id == user_id,
        Note.chapter_id == chapter_id
    ).order_by(desc(Note.created_at)).all()


def delete_note(db: Session, note_id: str, user_id: str) -> bool:
    """Delete a note (only if owned by user)."""
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        return False
    
    db.delete(note)
    db.commit()
    return True
