from fastapi import APIRouter, HTTPException, status
from typing import List
from Backend.utils import Scraper
from Backend.models import CarModel
import re

router = APIRouter(prefix="/api")
Scraper = Scraper()
@router.get("/model/{brand}", response_model=List[CarModel])
async def get_model_by_brand(brand_name: str):
    """
    ดึงรายชื่อรุ่นของแบรนด์
    """
    try:
        pattern = (
            r'<a href="([^"]+)" title="[^"]+? specs and photos">'
            r'<img[^>]+src="([^"]+)"[^>]*>'
            r'.*?<h4>([^<]+)</h4>'
        )

        url = f"/{brand_name.lower()}"  
        matches = Scraper.find(pattern, url)  
        for match in matches:
            print(match)
        models = []
        for brand, image_url, name in matches:
            models.append(CarModel(
                image_url=image_url.strip(),
                brand_url=brand.strip(),
                name=name.strip()
            ))
        
        if not models:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No models found for brand '{brand_name}'"
            )
        return models

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
