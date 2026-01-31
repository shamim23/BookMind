# Data module for hardcoded content
from .concept_mappings import find_concept_mappings, get_concepts_for_book, CROSS_DOMAIN_MAPPINGS
from .dialectic_fallbacks import get_fallback_dialectic
from .evidence_mappings import get_evidence_mapping, EVIDENCE_MAPPINGS
from .sample_books import get_sample_book, get_all_sample_books, SAMPLE_BOOKS, CATEGORIES

__all__ = [
    "find_concept_mappings",
    "get_concepts_for_book",
    "CROSS_DOMAIN_MAPPINGS",
    "get_fallback_dialectic",
    "get_evidence_mapping",
    "EVIDENCE_MAPPINGS",
    "get_sample_book",
    "get_all_sample_books",
    "SAMPLE_BOOKS",
    "CATEGORIES",
]
