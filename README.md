# AutoCar - Car Web Scraper API

> A project for Theory of Computation subject in CE KMITL

**AutoCar** is a FastAPI-based web scraper that extracts car brand and model information from automotive websites and provides it through REST API endpoints. The application can scrape data, serve it via API, and export it to CSV files for further analysis.

## 🚦 Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ToC/AutoCar
   ```

2. **Install dependencies**
   ```bash
   pip install fastapi uvicorn cloudscraper pydantic
   ```

3. **Run the application**
   ```bash
   uvicorn main:app --reload --port 5000
   ```

4. **Access the API**
   - API Base URL: `http://127.0.0.1:5000`
   - Interactive API Docs: `http://127.0.0.1:5000/docs`
   - ReDoc Documentation: `http://127.0.0.1:5000/redoc`

## 📚 API Endpoints

### Base URL: `http://127.0.0.1:5000`

### 🏠 Root Endpoint
- **GET** `/`
  - **Description**: Health check endpoint
  - **Response**: Basic API information

### 🚗 Brand Endpoints
- **GET** `/api/brands`
  - **Description**: Get all available car brands
  - **Example Response**:
    ```json
    [
      {
        "name": "TOYOTA",
        "site_url": "/toyota",
        "image_url": "https://example.com/toyota-logo.jpg"
      }
    ]
    ```

### 🚙 Model Endpoints
- **GET** `/api/model/{brand}`
  - **Description**: Get all models for a specific brand
  - **Example**: `GET /api/model/toyota`
  - **Example Response**:
    ```json
    [
      {
        "name": "Camry",
        "brand_url": "/toyota/camry",
        "image_url": "https://example.com/camry.jpg"
      }
    ]
    ```
### 🏎️ Model Detail Endpoints
- **GET** `/api/model/{brand}/{model_name}`
  - **Description**: Get all models for a specific brand
  - **Example**: `GET /api/model/ac/cobra`
  - **Example Response**:
    ```json
    [
      {
        "image_url": "https://s1.cdn.autoevolution.com/images/models/AC-_Cobra-MkIII-1965_main.jpg",
        "name": "AC  Cobra MkIII (1965 - 1967)",
        "production_years": "1965 - 1967",
        "engines": [
          "4.7L V8 4MT RWD (280 HP)"
        ]
      }
    ]
    ```  
### 🏎️ Model Detail Endpoints
- **GET** `/api/search/query{string}`
  - **Description**: Get all data from search
  - **Example**: `GET /api/search?query=bmw`
  - **Example Response**:
    ```json
    [
      {
        "results": [
          {
            "type": "brand",
            "name": "BMW",
            "url": "https://www.autoevolution.com/bmw/",
            "image_url": "https://s1.cdn.autoevolution.com/images/producers/bmw-sm.jpg",
            "brand_name": null,
            "details": null
          },
          {
            "type": "model",
            "name": "BMW iX",
            "url": "https://www.autoevolution.com/bmw/ix/",
            "image_url": "https://s1.cdn.autoevolution.com/images/models/thumb/BMW_iX-2025_main.jpg_tmb.jpg",
            "brand_name": "BMW",
            "details": null
          },
          {
            "type": "model",
            "name": "BMW M3 CS Touring",
            "url": "https://www.autoevolution.com/bmw/m3-cs-touring/",
            "image_url": "https://s1.cdn.autoevolution.com/images/models/thumb/BMW_M3-CS-Touring-2025_main.jpg_tmb.jpg",
            "brand_name": "BMW",
            "details": null
          }
        ]
      }
    ]
    ```  

### 📊 CSV Export Endpoints
- **GET** `/api/export/all`
  - **Description**: Scrape all data and generate CSV files
  - **Response**: Information about generated CSV files and download links
  - **Example Response**:
    ```json
    {
      "status": "success",
      "message": "CSV export completed successfully",
      "files": {
        "brands_csv": "exports/car_brands.csv",
        "models_csv": "exports/car_models.csv", 
        "combined_csv": "exports/car_data_combined.csv"
      },
      "download_endpoints": {
        "brands": "/api/download/csv/brands",
        "models": "/api/download/csv/models",
        "combined": "/api/download/csv/combined"
      }
    }
    ```

## 👥 Authors

- **Course**: Theory of Computation
- **Institution**: Computer Engineering, KMITL

---