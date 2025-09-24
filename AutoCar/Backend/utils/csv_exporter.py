import csv
import re
from typing import List, Dict, Any
from pathlib import Path
from Backend.utils.scraper import Scraper
from Backend.models import CarBrand, CarModel


class CSVExporter:
    def __init__(self, output_dir: str = "exports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.scraper = Scraper()
        
        self.brand_url_exceptions = {
            "SSANGYONG": "/ssang-yong",
            "TATA MOTORS": "/tata-motors", 
            "TESLA": "/tesla-motor"
        }
        
    def scrape_all_brands(self) -> List[CarBrand]:
        """
        Scrape all car brands from the website
        """
        pattern = r'<a\s+href="([^"]+)"\s+title="([^"]+?)\s*">\s*<img[^>]+src="([^"]+)"'
        matches = self.scraper.find(pattern, "cars")
        
        brands = []
        for site_url, name, image_url in matches:
            brands.append(CarBrand(
                site_url=site_url.strip(),
                name=name.strip(),
                image_url=image_url.strip()
            ))
        return brands
    
    def scrape_models_for_brand(self, brand_url: str, brand_name: str = "") -> List[CarModel]:
        """
        Scrape all models for a specific brand using the brand's site_url
        """
        pattern = (
            r'<a href="([^"]+)" title="[^"]+? specs and photos">'
            r'<img[^>]+src="([^"]+)"[^>]*>'
            r'.*?<h4>([^<]+)</h4>'
        )
        
        matches = self.scraper.find(pattern, brand_url)
        
        models = []
        for brand_url, image_url, name in matches:
            models.append(CarModel(
                image_url=image_url.strip(),
                brand_url=brand_url.strip(),
                name=name.strip()
            ))
        return models
    
    def generate_possible_urls(self, brand_name: str) -> List[str]:
        """
        Generate possible URL formats for a brand name
        """
        clean_name = brand_name.lower()
        possible_urls = []
        
        possible_urls.append(f"/{clean_name}")
        
        possible_urls.append(f"/{clean_name.replace(' ', '-')}")
        
        possible_urls.append(f"/{clean_name.replace(' ', '_')}")
        
        possible_urls.append(f"/{clean_name.replace(' ', '')}")
        
        first_word = clean_name.split()[0]
        possible_urls.append(f"/{first_word}")
        
        return list(set(possible_urls))  
    
    def scrape_all_data(self) -> Dict[str, Any]:
        """
        Scrape all brands and their models in one operation
        Returns a dictionary with brands and all their models
        """
        print("Scraping all brands...")
        brands = self.scrape_all_brands()
        print(f"Found {len(brands)} brands")
        
        all_data = {
            'brands': brands,
            'models_by_brand': {},
            'all_models': []
        }
        
        for brand in brands:
            print(f"Scraping models for {brand.name}")
            models = []
            success = False

            try:
                print(f"  Trying original URL: {brand.site_url}")
                models = self.scrape_models_for_brand(brand.site_url, brand.name)
                if models:
                    success = True
                    print(f"  Found {len(models)} models using original URL")
            except Exception as e:
                print(f"  Original URL failed: {e}")
            
            if not success and brand.name in self.brand_url_exceptions:
                try:
                    exception_url = self.brand_url_exceptions[brand.name]
                    print(f"  Trying exception URL: {exception_url}")
                    models = self.scrape_models_for_brand(exception_url, brand.name)
                    if models:
                        success = True
                        print(f"  Found {len(models)} models using exception URL")
                except Exception as e:
                    print(f"  Exception URL failed: {e}")
        
            if not success:
                possible_urls = self.generate_possible_urls(brand.name)
                for url in possible_urls:
                    try:
                        print(f"  Trying generated URL: {url}")
                        models = self.scrape_models_for_brand(url, brand.name)
                        if models:
                            success = True
                            print(f"  Found {len(models)} models using URL: {url}")
                            break
                    except Exception as e:
                        print(f"  URL {url} failed: {e}")
            
            all_data['models_by_brand'][brand.name] = models
            
            for model in models:
                model_dict = model.dict()
                model_dict['brand_name'] = brand.name
                all_data['all_models'].append(model_dict)
            
            if not success:
                print(f"  No models found for {brand.name} after trying all URL formats")
                
        return all_data
    
    # def export_brands_to_csv(self, brands: List[CarBrand], filename: str = "car_brands.csv") -> str:
    #     """
    #     Export brands to CSV file
    #     """
    #     output_path = self.output_dir / filename
        
    #     with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
    #         fieldnames = ['name', 'site_url', 'image_url']
    #         writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
    #         writer.writeheader()
    #         for brand in brands:
    #             writer.writerow(brand.dict())
                
    #     return str(output_path)
    
    # def export_models_to_csv(self, models_data: List[Dict[str, Any]], filename: str = "car_models.csv") -> str:
    #     """
    #     Export models to CSV file (includes brand_name for each model)
    #     """
    #     output_path = self.output_dir / filename
        
    #     with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
    #         fieldnames = ['brand_name', 'name', 'brand_url', 'image_url']
    #         writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
    #         writer.writeheader()
    #         for model in models_data:
    #             writer.writerow(model)
                
    #     return str(output_path)
    
    def export_combined_to_csv(self, all_data: Dict[str, Any], filename: str = "car_data_combined.csv") -> str:
        """
        Export all data to a single CSV file with brand and model information
        """
        output_path = self.output_dir / filename
        
        with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = [
                'brand_name', 'brand_site_url', 'brand_image_url',
                'model_name', 'model_brand_url', 'model_image_url'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            
            for brand in all_data['brands']:
                models = all_data['models_by_brand'].get(brand.name, [])
                
                if models:
                    for model in models:
                        writer.writerow({
                            'brand_name': brand.name,
                            'brand_site_url': brand.site_url,
                            'brand_image_url': brand.image_url,
                            'model_name': model.name,
                            'model_brand_url': model.brand_url,
                            'model_image_url': model.image_url
                        })
                else:
                    writer.writerow({
                        'brand_name': brand.name,
                        'brand_site_url': brand.site_url,
                        'brand_image_url': brand.image_url,
                        'model_name': '',
                        'model_brand_url': '',
                        'model_image_url': ''
                    })
                    
        return str(output_path)
    
    def export_all_to_csv(self) -> Dict[str, str]:
        """
        Main function to scrape all data and export to CSV files
        Returns paths to the created CSV files
        """
        print("Starting complete data scraping and CSV export...")
        
        all_data = self.scrape_all_data()
        
        results = {}
        
        # brands_path = self.export_brands_to_csv(all_data['brands'])
        # results['brands_csv'] = brands_path
        # print(f"Brands exported to: {brands_path}")
        
        # models_path = self.export_models_to_csv(all_data['all_models'])
        # results['models_csv'] = models_path
        # print(f"Models exported to: {models_path}")
        
        combined_path = self.export_combined_to_csv(all_data)
        results['combined_csv'] = combined_path
        print(f"Combined data exported to: {combined_path}")
        
        # print(f"Total brands: {len(all_data['brands'])}")
        # print(f"Total models: {len(all_data['all_models'])}")
        
        return results