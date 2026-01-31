"""News API Service for finding relevant news articles."""

from app.core.config import get_settings

settings = get_settings()

# Hardcoded news data for demonstration
NEWS_ARTICLES = [
    {
        "title": "AI Revolution Transforms Manufacturing Sector",
        "description": "New AI technologies are reshaping how factories operate, with significant implications for division of labor and worker roles.",
        "date": "2024-12-15",
        "connection": "Relates to Smith's discussion of productivity and specialization in the modern AI era",
        "url": "https://example.com/news/ai-manufacturing",
        "source": "Tech Chronicle"
    },
    {
        "title": "Global Trade Patterns Shift Amid Economic Changes",
        "description": "International trade agreements are being renegotiated as countries reassess their comparative advantages.",
        "date": "2024-11-28",
        "connection": "Illustrates Smith's principles of trade in contemporary geopolitics",
        "url": "https://example.com/news/trade-patterns",
        "source": "Economic Review"
    },
    {
        "title": "The Future of Work: Automation and Employment",
        "description": "As automation advances, economists debate the future of labor markets and worker specialization.",
        "date": "2024-12-20",
        "connection": "Modern application of division of labor principles in the age of automation",
        "url": "https://example.com/news/future-of-work",
        "source": "Labor Weekly"
    },
    {
        "title": "Behavioral Economics in Policy Making",
        "description": "Governments increasingly use insights from behavioral economics to design better policies.",
        "date": "2024-10-30",
        "connection": "Contemporary application of understanding human decision-making",
        "url": "https://example.com/news/behavioral-policy",
        "source": "Policy Today"
    },
    {
        "title": "Quantum Computing Breakthrough Announced",
        "description": "Scientists achieve new milestone in quantum computing, potentially revolutionizing computation.",
        "date": "2024-12-10",
        "connection": "Advances our understanding of quantum mechanics discussed in physics texts",
        "url": "https://example.com/news/quantum-breakthrough",
        "source": "Science Daily"
    }
]


def find_relevant_news(chapter_title: str, chapter_content: str) -> list[dict]:
    """Find news articles relevant to the chapter topic."""
    # Simple keyword matching for demonstration
    # In production, this would use a real news API or vector search
    
    chapter_text = (chapter_title + " " + chapter_content).lower()
    
    # Define keyword mappings
    topic_keywords = {
        "economics": ["market", "trade", "labor", "economy", "price", "wealth", "capital", "profit"],
        "psychology": ["mind", "thinking", "cognitive", "behavior", "decision", "bias", "mental"],
        "physics": ["atom", "energy", "quantum", "physics", "gravity", "thermodynamics", "force"],
        "philosophy": ["philosophy", "mind", "existence", "god", "knowledge", "truth", "reason"],
        "technology": ["computer", "ai", "digital", "internet", "software", "technology", "innovation"],
    }
    
    # Score each article based on relevance
    scored_articles = []
    for article in NEWS_ARTICLES:
        score = 0
        article_text = (article["title"] + " " + article["description"] + " " + article["connection"]).lower()
        
        for topic, keywords in topic_keywords.items():
            if any(kw in chapter_text for kw in keywords):
                if any(kw in article_text for kw in keywords):
                    score += 1
        
        if score > 0:
            scored_articles.append((score, article))
    
    # Sort by score and return top 3
    scored_articles.sort(key=lambda x: x[0], reverse=True)
    return [article for _, article in scored_articles[:3]]
