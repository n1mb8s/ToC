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