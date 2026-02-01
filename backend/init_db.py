"""Initialize database and sync sample books."""

import asyncio
import httpx
from app.db.database import init_db


async def sync_sample_books():
    """Sync all sample books to the database."""
    base_url = "http://localhost:8000"
    sample_book_ids = [
        "physics-1",
        "philosophy-1", 
        "economics-1",
        "psychology-1"
    ]
    
    async with httpx.AsyncClient() as client:
        for book_id in sample_book_ids:
            try:
                response = await client.post(f"{base_url}/books/sample/sync/{book_id}")
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ {data['message']}")
                else:
                    print(f"❌ Failed to sync {book_id}: {response.text}")
            except Exception as e:
                print(f"❌ Error syncing {book_id}: {e}")


def main():
    print("🚀 Initializing BookMind AI Database...")
    
    # Create tables
    init_db()
    print("✅ Database tables created")
    
    # Sync sample books (requires server to be running)
    print("\n📚 Syncing sample books...")
    print("(Make sure the server is running on port 8000)")
    
    try:
        asyncio.run(sync_sample_books())
    except Exception as e:
        print(f"⚠️  Could not sync sample books: {e}")
        print("You can sync them later by calling POST /books/sample/sync/{sample_id}")
    
    print("\n✅ Database initialization complete!")


if __name__ == "__main__":
    main()
