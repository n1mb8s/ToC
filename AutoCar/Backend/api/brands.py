import re 
from fastapi import APIRouter, HTTPException, status
from Backend.models import CarBrand
from Backend.utils import Scraper

router = APIRouter(prefix="/api")

Scraper = Scraper()

@router.get("/brands", response_model=list[CarBrand])
async def get_brands():
    try:
        # ดึงข้อมูล brand ทั้งหมด
        pattern = r'<a\s+href="([^"]+)"\s+title="([^"]+?)\s*">\s*<img[^>]+src="([^"]+)"'
        matches = Scraper.find(pattern, "cars")
        
        # สร้าง list ของ CarBrand
        brands = []
        for match in matches:
            print(match)
        for site_url, name, image_url in matches:
            brands.append(
                CarBrand(
                    site_url=site_url.strip(),
                    name=name.strip(),
                    image_url=image_url.strip()
            )
            )
        return brands
        
        return brands
    except Exception as e:
        # ถ้าเกิด error ส่ง HTTP 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )