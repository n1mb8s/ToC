import os
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from Backend.utils import CSVExporter
from typing import Dict

router = APIRouter(prefix="/api")

@router.get("/export/all")
async def export_all_to_csv():
    """
    Scrape all car brands and models data and export to CSV files
    Returns information about the generated CSV files
    """
    try:
        exporter = CSVExporter()
        results = exporter.export_all_to_csv()
        
        return {
            "status": "success",
            "message": "CSV export completed successfully",
            "files": results,
            "download_endpoints": {
                "combined": "/api/download/csv/combined"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"CSV export failed: {str(e)}"
        )

# @router.get("/download/csv/brands")
# async def download_brands_csv():
#     """
#     Download the brands CSV file
#     """
#     file_path = "exports/car_brands.csv"
#     if not os.path.exists(file_path):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Brands CSV file not found. Please run export first."
#         )
    
#     return FileResponse(
#         path=file_path,
#         filename="car_brands.csv",
#         media_type='text/csv'
#     )

# @router.get("/download/csv/models")
# async def download_models_csv():
#     """
#     Download the models CSV file
#     """
#     file_path = "exports/car_models.csv"
#     if not os.path.exists(file_path):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Models CSV file not found. Please run export first."
#         )
    
#     return FileResponse(
#         path=file_path,
#         filename="car_models.csv",
#         media_type='text/csv'
#     )

@router.get("/download/csv/combined")
async def download_combined_csv():
    """
    Download the combined CSV file
    """
    file_path = "exports/car_data_combined.csv"
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Combined CSV file not found. Please run export first."
        )
    
    return FileResponse(
        path=file_path,
        filename="car_data_combined.csv",
        media_type='text/csv'
    )