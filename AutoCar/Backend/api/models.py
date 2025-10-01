from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from Backend.utils import Scraper
from Backend.models import CarModel, CarBrand, SearchResultItem, SearchResults
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
    
        raw_html = Scraper.fetch_raw_html(url_path)
        
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

@router.get("/search", response_model=SearchResults)
async def search_cars(query: str):
    """
    ค้นหารถยนต์, รุ่น, หรือรายละเอียดตามคำค้นหา
    """
    results: List[SearchResultItem] = []
    
    # Search for brands
    try:
        brand_pattern = r'<a\s+href="([^"]+)"\s+title="([^"]+?)\s*">\s*<img[^>]+src="([^"]+)"'
        all_brands_matches = Scraper.find(brand_pattern, "cars")
        print(f"DEBUG: All brands found: {all_brands_matches}")
        
        for site_url, name, image_url in all_brands_matches:
            if query.lower() in name.lower():
                results.append(SearchResultItem(
                    type="brand",
                    name=name.strip(),
                    url=site_url.strip(),
                    image_url=image_url.strip()
                ))
                # If a brand matches the query, include all its models
                try:
                    model_pattern = r'<a href="([^"]+)" title="[^"]+? specs and photos">' r'<img[^>]+src="([^"]+)"[^>]*>' r'.*?<h4>([^<]+)</h4>'
                    models_url = f"/{name.lower()}"
                    print(f"DEBUG: Attempting to fetch all models for brand '{name}' from URL: '{models_url}'")
                    models_matches = Scraper.find(model_pattern, models_url)
                    print(f"DEBUG: All models found for brand '{name}': {models_matches}")
                    
                    for model_brand_url, model_image_url, model_name in models_matches:
                        cleaned_model_name = re.sub(r'\s+', ' ', model_name).strip()
                        results.append(SearchResultItem(
                            type="model",
                            name=cleaned_model_name,
                            url=model_brand_url.strip(),
                            image_url=model_image_url.strip(),
                            brand_name=name.strip()
                        ))
                        print(f"DEBUG: Added model '{cleaned_model_name}' for brand '{name}'")
                except Exception as e:
                    print(f"Error fetching all models for brand '{name}': {e}")
            
    except Exception as e:
        print(f"Error searching brands: {e}")

    # Search for models that don't belong to a matched brand (or if brand wasn't explicitly matched)
    # This part remains to catch models directly matching the query, even if their brand wasn't a direct match
    try:
        model_pattern = r'<a href="([^"]+)" title="[^"]+? specs and photos">' r'<img[^>]+src="([^"]+)"[^>]*>' r'.*?<h4>([^<]+)</h4>'
        
        # Iterate through all brands to find models
        # This can be optimized if we have a way to search models directly without knowing the brand first
        for brand_match in all_brands_matches:
            brand_name = brand_match[1].strip()
            brand_url_segment = brand_match[0].strip()
            print(f"DEBUG: Currently processing brand for model search: '{brand_name}', URL segment: '{brand_url_segment}'")
            
            # Fetch models for each brand and search within them
            models_url = f"/{brand_name.lower()}"
            print(f"DEBUG: Attempting to fetch models from URL: '{models_url}' for brand '{brand_name}'")
            models_matches = Scraper.find(model_pattern, models_url)
            print(f"DEBUG: Models found for brand '{brand_name}' from URL '{models_url}': {models_matches}")
            
            for model_brand_url, model_image_url, model_name in models_matches:
                cleaned_model_name = re.sub(r'\s+', ' ', model_name).strip() # Normalize spaces
                cleaned_combined_name = re.sub(r'\s+', ' ', f"{brand_name} {model_name}").strip() # Normalize spaces
                print(f"DEBUG: Query: '{query.lower()}', Cleaned Model Name: '{cleaned_model_name.lower()}', Cleaned Combined Name: '{cleaned_combined_name.lower()}'")
                
                # Only add if not already added by a brand match and if it matches the query
                # This prevents duplicate entries if a brand search already added all models
                is_already_added = any(
                    result.type == "model" and
                    result.name.lower() == cleaned_model_name.lower() and
                    result.brand_name.lower() == brand_name.lower()
                    for result in results
                )
                
                if not is_already_added and (query.lower() in cleaned_combined_name.lower() or query.lower() in cleaned_model_name.lower()):
                    results.append(SearchResultItem(
                        type="model",
                        name=cleaned_model_name, # Use cleaned name for result
                        url=model_brand_url.strip(),
                        image_url=model_image_url.strip(),
                        brand_name=brand_name
                    ))
                    
    except Exception as e:
        print(f"Error searching models for brand '{brand_name}': {e}")

    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No results found for query '{query}'"
        )
    
    return SearchResults(results=results)
