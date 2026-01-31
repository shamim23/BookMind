# Cross-Domain Concept Mapping Data
# Migrated from frontend/src/services/conceptMapping.ts

CROSS_DOMAIN_MAPPINGS = {
    "invisible hand": [
        {
            "id": "map-1",
            "targetConcept": "Emergence in Ant Colonies",
            "targetDomain": "Biology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-4",
            "targetChapterTitle": "The Gene Machine",
            "structuralSimilarity": "Complex, organized behavior emerges from many individuals following simple local rules without central coordination. No single ant (or actor) designs the colony (or market), yet sophisticated order emerges.",
            "keyDifferences": "Ant colonies evolved over millions of years; markets are human institutions. Ants follow genetic programming; humans make conscious choices.",
            "relevanceScore": 92
        },
        {
            "id": "map-2",
            "targetConcept": "Distributed Consensus",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-8",
            "targetChapterTitle": "The Internet",
            "structuralSimilarity": "No central authority needed for agreement. Nodes (computers/actors) reach consensus through local interactions and protocols, creating global order from local decisions.",
            "keyDifferences": "Distributed systems have explicit protocols; markets have implicit price signals. Computer systems are designed; markets evolved organically.",
            "relevanceScore": 88
        },
        {
            "id": "map-3",
            "targetConcept": "Organic City Development",
            "targetDomain": "Urban Planning",
            "targetBookId": "history-1",
            "targetBookTitle": "Sapiens",
            "targetChapterId": "ch-11",
            "targetChapterTitle": "Imperial Visions",
            "structuralSimilarity": "Cities grow and self-organize through countless individual decisions without a master planner. Order emerges from the bottom up through local interactions.",
            "keyDifferences": "Cities have zoning and planning interventions; markets have fewer constraints. Urban development is physical; markets are abstract.",
            "relevanceScore": 85
        },
        {
            "id": "map-4",
            "targetConcept": "Decentralized Consensus",
            "targetDomain": "Current Events",
            "targetBookId": "news",
            "targetBookTitle": "Cryptocurrency Networks",
            "structuralSimilarity": "Bitcoin and other cryptocurrencies coordinate global transactions without a central bank, using distributed consensus mechanisms similar to how markets coordinate economic activity.",
            "keyDifferences": "Crypto uses mathematical algorithms; markets use price signals. Crypto is programmable; markets are emergent.",
            "relevanceScore": 90
        }
    ],
    "division of labor": [
        {
            "id": "map-5",
            "targetConcept": "Cellular Specialization",
            "targetDomain": "Biology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-2",
            "targetChapterTitle": "The Replicators",
            "structuralSimilarity": "Cells specialize into different types (muscle, nerve, blood) to increase organism efficiency, just as workers specialize to increase economic output.",
            "keyDifferences": "Cellular differentiation is genetically programmed; labor division is socially negotiated. Cells cannot choose their specialization; humans can.",
            "relevanceScore": 87
        },
        {
            "id": "map-6",
            "targetConcept": "Modular Software Architecture",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-5",
            "targetChapterTitle": "The Microchip",
            "structuralSimilarity": "Breaking software into specialized modules that each handle one function, allowing teams to work independently and systems to scale efficiently.",
            "keyDifferences": "Software modules have defined interfaces; workers have social dynamics. Code doesn't have consciousness; workers do.",
            "relevanceScore": 84
        },
        {
            "id": "map-7",
            "targetConcept": "Eusocial Insect Castes",
            "targetDomain": "Biology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-10",
            "targetChapterTitle": "You Scratch My Back",
            "structuralSimilarity": "Bees have queens, workers, and drones with specialized roles that maximize colony productivity through extreme specialization.",
            "keyDifferences": "Insect castes are biologically determined; human specialization is chosen. Insects cannot change roles; humans can retrain.",
            "relevanceScore": 82
        }
    ],
    "natural selection": [
        {
            "id": "map-8",
            "targetConcept": "Market Competition",
            "targetDomain": "Economics",
            "targetBookId": "economics-1",
            "targetBookTitle": "The Wealth of Nations",
            "targetChapterId": "ch-1",
            "targetChapterTitle": "Of the Division of Labor",
            "structuralSimilarity": "Firms compete for resources and customers; the 'fittest' (most efficient, best adapted) survive while others fail. Selection pressure drives improvement.",
            "keyDifferences": "Markets operate much faster than evolution. Businesses can consciously adapt; species cannot. Markets involve intentional strategy; evolution is blind.",
            "relevanceScore": 91
        },
        {
            "id": "map-9",
            "targetConcept": "Meme Propagation",
            "targetDomain": "Psychology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-11",
            "targetChapterTitle": "Memes: The New Replicators",
            "structuralSimilarity": "Ideas spread and evolve through cultural selection, with 'fit' memes (catchy, useful, memorable) outcompeting others for human attention.",
            "keyDifferences": "Memes spread horizontally (between individuals); genes vertically (parent to offspring). Meme evolution is Lamarckian (acquired traits spread).",
            "relevanceScore": 89
        },
        {
            "id": "map-10",
            "targetConcept": "Technological Evolution",
            "targetDomain": "Technology",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-1",
            "targetChapterTitle": "Ada, Countess of Lovelace",
            "structuralSimilarity": "Technologies evolve through variation (innovation), selection (market adoption), and inheritance (building on prior tech).",
            "keyDifferences": "Technology evolution is guided by human intention; biological evolution is not. Tech can be designed; biology is emergent.",
            "relevanceScore": 86
        }
    ],
    "entropy": [
        {
            "id": "map-11",
            "targetConcept": "Organizational Decay",
            "targetDomain": "Business",
            "targetBookId": "economics-1",
            "targetBookTitle": "The Wealth of Nations",
            "targetChapterId": "ch-3",
            "targetChapterTitle": "Of the Accumulation of Capital",
            "structuralSimilarity": "Without continuous energy input (management attention, resources), organizations naturally drift toward disorder, inefficiency, and stagnation.",
            "keyDifferences": "Organizations can be intentionally restructured; physical systems cannot. Human agency can reverse organizational entropy.",
            "relevanceScore": 88
        },
        {
            "id": "map-12",
            "targetConcept": "Information Overload",
            "targetDomain": "Psychology",
            "targetBookId": "psychology-1",
            "targetBookTitle": "Thinking, Fast and Slow",
            "targetChapterId": "ch-3",
            "targetChapterTitle": "The Lazy Controller",
            "structuralSimilarity": "As information increases without organization, signal-to-noise ratio decreases and decision quality degrades—cognitive entropy.",
            "keyDifferences": "Information entropy can be managed with systems; thermodynamic entropy cannot be reversed.",
            "relevanceScore": 85
        },
        {
            "id": "map-13",
            "targetConcept": "Software Rot",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-7",
            "targetChapterTitle": "Software",
            "structuralSimilarity": "Codebases naturally become more complex and disorganized over time without refactoring, making them harder to maintain and understand.",
            "keyDifferences": "Software can be refactored; physical entropy cannot be undone. Code entropy is reversible with effort.",
            "relevanceScore": 83
        }
    ],
    "system 1": [
        {
            "id": "map-14",
            "targetConcept": "Reflex Arc",
            "targetDomain": "Biology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-1",
            "targetChapterTitle": "Why Are People?",
            "structuralSimilarity": "Automatic, fast responses to stimuli that bypass conscious processing—like pulling your hand from a hot stove without thinking.",
            "keyDifferences": "Reflexes are hardwired; System 1 can be trained. Reflexes are stimulus-bound; System 1 uses heuristics and patterns.",
            "relevanceScore": 87
        },
        {
            "id": "map-15",
            "targetConcept": "Cache Memory",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-5",
            "targetChapterTitle": "The Microchip",
            "structuralSimilarity": "Fast, automatic retrieval of frequently accessed data without going through slower main processing—mental shortcuts that save time.",
            "keyDifferences": "Cache is deterministic; System 1 is heuristic. Cache never makes errors; System 1 often does.",
            "relevanceScore": 84
        },
        {
            "id": "map-16",
            "targetConcept": "Muscle Memory",
            "targetDomain": "Psychology",
            "targetBookId": "psychology-1",
            "targetBookTitle": "Thinking, Fast and Slow",
            "targetChapterId": "ch-4",
            "targetChapterTitle": "The Associative Machine",
            "structuralSimilarity": "Learned behaviors become automatic through repetition, allowing skilled performance without conscious attention to each step.",
            "keyDifferences": "Muscle memory is physical; System 1 is cognitive. Both can be trained, but muscle memory is more reliable.",
            "relevanceScore": 86
        }
    ],
    "cogito ergo sum": [
        {
            "id": "map-17",
            "targetConcept": "Self-Awareness Loop",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-9",
            "targetChapterTitle": "The Web",
            "structuralSimilarity": "A system that can observe and reason about its own state—self-monitoring processes in AI and operating systems.",
            "keyDifferences": "Computer self-monitoring is programmed; human self-awareness is emergent. Machines don't experience; humans do.",
            "relevanceScore": 85
        },
        {
            "id": "map-18",
            "targetConcept": "Metacognition",
            "targetDomain": "Psychology",
            "targetBookId": "psychology-1",
            "targetBookTitle": "Thinking, Fast and Slow",
            "targetChapterId": "ch-5",
            "targetChapterTitle": "Cognitive Ease",
            "structuralSimilarity": "Thinking about thinking—monitoring one's own cognitive processes, which requires a sense of self as the thinker.",
            "keyDifferences": "Metacognition is a cognitive process; cogito is a philosophical foundation. One studies thinking; the other proves existence.",
            "relevanceScore": 88
        }
    ],
    "gene": [
        {
            "id": "map-19",
            "targetConcept": "Meme",
            "targetDomain": "Psychology",
            "targetBookId": "biology-1",
            "targetBookTitle": "The Selfish Gene",
            "targetChapterId": "ch-11",
            "targetChapterTitle": "Memes: The New Replicators",
            "structuralSimilarity": "Self-replicating units of information that spread through populations, subject to selection pressures and mutation.",
            "keyDifferences": "Genes are chemical; memes are informational. Genes replicate vertically; memes spread horizontally.",
            "relevanceScore": 95
        },
        {
            "id": "map-20",
            "targetConcept": "Algorithm",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-2",
            "targetChapterTitle": "The Computer",
            "structuralSimilarity": "Encoded instructions that determine behavior/output. Genes are nature's algorithms for building organisms.",
            "keyDifferences": "Algorithms are designed; genes evolved. Algorithms are deterministic; gene expression is probabilistic.",
            "relevanceScore": 82
        }
    ],
    "first principles": [
        {
            "id": "map-21",
            "targetConcept": "Root Cause Analysis",
            "targetDomain": "Business",
            "targetBookId": "economics-1",
            "targetBookTitle": "The Wealth of Nations",
            "targetChapterId": "ch-2",
            "targetChapterTitle": "Of the Principle of the Commercial System",
            "structuralSimilarity": "Breaking down problems to their fundamental causes rather than treating symptoms—stripping away assumptions to find truth.",
            "keyDifferences": "Root cause analysis is applied methodically; first principles is philosophical foundation. Both seek fundamental truths.",
            "relevanceScore": 90
        },
        {
            "id": "map-22",
            "targetConcept": "Axiomatic Systems",
            "targetDomain": "Mathematics",
            "targetBookId": "physics-1",
            "targetBookTitle": "The Feynman Lectures",
            "targetChapterId": "ch-2",
            "targetChapterTitle": "Basic Physics",
            "structuralSimilarity": "Building knowledge from self-evident axioms rather than inherited assumptions—mathematical reasoning from foundations.",
            "keyDifferences": "Axioms are assumed true; first principles are discovered. Mathematics is abstract; first principles apply to reality.",
            "relevanceScore": 87
        }
    ],
    "emergence": [
        {
            "id": "map-23",
            "targetConcept": "Spontaneous Order",
            "targetDomain": "Economics",
            "targetBookId": "economics-1",
            "targetBookTitle": "The Wealth of Nations",
            "targetChapterId": "ch-1",
            "targetChapterTitle": "Of the Division of Labor",
            "structuralSimilarity": "Order that emerges without central planning or design, from the interactions of many independent agents following simple rules.",
            "keyDifferences": "Emergence is broader concept; spontaneous order is economic. Emergence applies to all systems; spontaneous order to human institutions.",
            "relevanceScore": 92
        },
        {
            "id": "map-24",
            "targetConcept": "Swarm Intelligence",
            "targetDomain": "Computer Science",
            "targetBookId": "technology-1",
            "targetBookTitle": "The Innovators",
            "targetChapterId": "ch-8",
            "targetChapterTitle": "The Internet",
            "structuralSimilarity": "Collective behavior of decentralized, self-organized systems—where the whole is smarter than the sum of individuals.",
            "keyDifferences": "Swarm intelligence is typically algorithmic; emergence is natural. Both show bottom-up organization.",
            "relevanceScore": 88
        }
    ]
}


def find_concept_mappings(concept: str, user_book_ids: list[str] = None) -> list[dict]:
    """Find concept mappings for a given concept."""
    if user_book_ids is None:
        user_book_ids = []
    
    normalized_concept = concept.lower().strip()
    
    # Find exact match
    analogies = CROSS_DOMAIN_MAPPINGS.get(normalized_concept, [])
    
    # If no exact match, try partial matches
    if not analogies:
        for key, mappings in CROSS_DOMAIN_MAPPINGS.items():
            if normalized_concept in key or key in normalized_concept:
                analogies = mappings
                break
    
    # Filter to user's books and sort by relevance
    if user_book_ids:
        analogies = [
            a for a in analogies 
            if a["targetBookId"] in user_book_ids or a["targetBookId"] == "news"
        ]
    
    return sorted(analogies, key=lambda x: x["relevanceScore"], reverse=True)[:3]


def get_concepts_for_book(book_id: str) -> list[str]:
    """Get all concepts that have mappings for a given book."""
    concepts = []
    for concept, mappings in CROSS_DOMAIN_MAPPINGS.items():
        if any(m["targetBookId"] == book_id for m in mappings):
            concepts.append(concept)
    return concepts
