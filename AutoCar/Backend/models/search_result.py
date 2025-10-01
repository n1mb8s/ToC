from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class SearchResultItem(BaseModel):
    type: str # "brand", "model", "detail"
    name: str
    url: Optional[str] = None
    image_url: Optional[str] = None
    brand_name: Optional[str] = None # For models/details
    details: Optional[Dict[str, Any]] = None # For car details

class SearchResults(BaseModel):
    results: List[SearchResultItem]