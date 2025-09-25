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

@router.get("/model/{brand}/{model_name:path}", response_model=List[dict])
async def get_model_details(brand: str, model_name: str):
    """
    ดึงรายละเอียดของรถยนต์รุ่นที่ต้องการ
    """
    try:
        url_path = f"{brand.lower()}/{model_name}"
    
        raw_html = Scraper.get_raw_html(url_path)
        if not raw_html:
            Scraper.find(r"dummy_pattern_to_cache_page", url_path)
            raw_html = Scraper.get_raw_html(url_path)

        if not raw_html:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"HTML content not found for '{url_path}'"
            )
        
        car_details_list = Scraper.scrape_car_details(raw_html)

        if not car_details_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not parse any details for model at '{url_path}'"
            )
            
        return car_details_list

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
