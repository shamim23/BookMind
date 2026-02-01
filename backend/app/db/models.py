"""SQLAlchemy models for BookMind AI."""

from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base


def generate_uuid():
    """Generate a unique UUID string."""
    return str(uuid.uuid4())


class Book(Base):
    """Represents a book in the library."""
    __tablename__ = "books"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(500), nullable=False, index=True)
    author = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    cover_color = Column(String(50), default="#d0ff59")
    content = Column(Text, nullable=True)  # Full book content
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    total_chapters = Column(Integer, default=0)
    
    # Relationships
    chapters = relationship("Chapter", back_populates="book", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="book", cascade="all, delete-orphan")
    
    # For sample books, we store the sample_id to link them
    sample_id = Column(String(100), nullable=True, index=True)
    
    __table_args__ = (
        Index('idx_book_sample', 'sample_id'),
    )


class Chapter(Base):
    """Represents a chapter within a book."""
    __tablename__ = "chapters"

    id = Column(String, primary_key=True, default=generate_uuid)
    book_id = Column(String, ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Chapter info
    number = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    key_points = Column(JSON, default=list)  # Store as JSON array
    
    # Metadata
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    book = relationship("Book", back_populates="chapters")
    insights = relationship("Insight", back_populates="chapter", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_chapter_book_number', 'book_id', 'number'),
    )


class Insight(Base):
    """Represents an AI-generated insight for a chapter."""
    __tablename__ = "insights"

    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Relationships
    book_id = Column(String, ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    chapter_id = Column(String, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Insight content
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    implication = Column(Text, nullable=False)
    insight_type = Column(String(50), default="pattern")  # pattern, causal, distinction, counter_intuitive, framework
    
    # AI metadata
    ai_model = Column(String(100), nullable=True)  # e.g., "gpt-4o-mini"
    confidence_score = Column(Integer, nullable=True)  # 0-100 if we add scoring later
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Track if insight was user-modified
    is_ai_generated = Column(Integer, default=1)  # 1 = AI, 0 = User edited
    
    # Relationships
    book = relationship("Book", back_populates="insights")
    chapter = relationship("Chapter", back_populates="insights")
    
    __table_args__ = (
        Index('idx_insight_book', 'book_id'),
        Index('idx_insight_chapter', 'chapter_id'),
        Index('idx_insight_type', 'insight_type'),
    )


class UserBook(Base):
    """Links users to their books (for when we add user auth)."""
    __tablename__ = "user_books"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String(100), nullable=False, index=True)  # Will link to users table later
    book_id = Column(String, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    
    # Reading progress
    current_chapter = Column(Integer, default=1)
    progress_percent = Column(Integer, default=0)
    is_completed = Column(Integer, default=0)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_read_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    __table_args__ = (
        Index('idx_userbook_user', 'user_id'),
        Index('idx_userbook_book', 'book_id'),
    )


class Note(Base):
    """User notes and highlights on chapters."""
    __tablename__ = "notes"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String(100), nullable=False, index=True)
    book_id = Column(String, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(String, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    
    # Note content
    content = Column(Text, nullable=False)
    highlight_text = Column(Text, nullable=True)  # Text that was highlighted
    start_index = Column(Integer, nullable=True)  # Position in chapter content
    end_index = Column(Integer, nullable=True)
    
    # Note type
    note_type = Column(String(50), default="note")  # note, highlight, question
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index('idx_note_user', 'user_id'),
        Index('idx_note_book', 'book_id'),
        Index('idx_note_chapter', 'chapter_id'),
    )
