import re
import json
import cloudscraper
from typing import Any
from pathlib import Path
from Backend.config import CRAWLER_ENDPOINT, CRAWLER_HEADERS


class Scraper:
    def __init__(self):
        self.scraper = cloudscraper.create_scraper()

    def find(
        self,
        pattern: str,
        url_path: str,
        flags=re.DOTALL | re.IGNORECASE,
    ) -> list[Any]:
        """
        ถ้า url_path ไม่มีใน cache → ไปโหลดจากเว็บ
        ถ้ามีแล้ว → ใช้ cache ทันที
        """
        url = f"{CRAWLER_ENDPOINT}/{url_path}"
        response = self.scraper.get(url, headers=CRAWLER_HEADERS)

        if response.status_code != 200:
            raise Exception(f"Failed to get {url_path}, status {response.status_code}")

        raw_html = response.text
        matches = re.findall(pattern, raw_html, flags=flags)
        return matches

    def fetch_raw_html(self, url_path: str) -> str:
        url = f"{CRAWLER_ENDPOINT}/{url_path}"
        response = self.scraper.get(url, headers=CRAWLER_HEADERS)

        if response.status_code != 200:
            raise Exception(f"Failed to get {url_path}, status {response.status_code}")
        return response.text

    def parser(self, pattern: str, data: str, flags=re.DOTALL | re.IGNORECASE) -> list[str]:
        return re.findall(pattern, data, flags=flags)

    def scrape_car_details(self, html_content: str):
        all_car_details = []

        # Attempt to find multi-model blocks first
        car_block_pattern = r'(<div class="container carmodel mgbot_40 clearfix">.*?)(?=<div class="container carmodel mgbot_40 clearfix">|\Z)'
        car_blocks = re.findall(car_block_pattern, html_content, re.DOTALL)

        if car_blocks:
            # Process as multi-model page
            for block in car_blocks:
                details_dict = {}
                image_pattern = r'<img.*?src="([^"]*main\.jpg)".*?>'
                image_matches = self.parser(image_pattern, block)
                details_dict['image_url'] = image_matches[0] if image_matches else None

                title_pattern = r'<a href="[^"]+" title="([^"]+? specs and photos)">'
                title_matches = self.parser(title_pattern, block)
                
                if title_matches:
                    full_title = title_matches[0]
                    details_dict['name'] = full_title.replace(' specs and photos', '').strip()
                    production_years_pattern = r'\((\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*Present)\)'
                    production_years_matches = re.search(production_years_pattern, full_title)
                    if production_years_matches:
                        details_dict['production_years'] = production_years_matches.group(1).strip()
                    else:
                        details_dict['production_years'] = None
                else:
                    details_dict['name'] = None
                    details_dict['production_years'] = None

                initial_details_pattern = r'<strong>(Generations|First production year|Engines|Body style):<\/strong>\s*([^<]*)'
                initial_details_matches = self.parser(initial_details_pattern, block)
                for key, value in initial_details_matches:
                    details_dict[key.replace(' ', '_').lower()] = value.strip()

                engine_pattern = r'<p class="engitm subtlesep_top"><a href="[^"]+" class="engurl semibold" title="[^"]+">.*?<span class="col-green2">([^<]+)</span></a></p>'
                engine_matches = self.parser(engine_pattern, block)
                details_dict['engines'] = [engine.strip() for engine in engine_matches] if engine_matches else []

                news_text = self.scrape_news_text(block)
                if news_text:
                    details_dict['description'] = " ".join(news_text)

                all_car_details.append(details_dict)
        else:
            details_dict = {}

            h1_pattern = r'<h1>\s*<b>([^<]+)</b>\s*</h1>'
            h1_matches = self.parser(h1_pattern, html_content)
            if h1_matches:
                full_name_from_h1 = h1_matches[0].strip()
                details_dict['name'] = full_name_from_h1
                years_in_name_pattern = r'\((\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*Present)\)'
                years_in_name_matches = re.search(years_in_name_pattern, full_name_from_h1)
                if years_in_name_matches:
                    details_dict['production_years'] = years_in_name_matches.group(1).strip()
                else:
                    details_dict['production_years'] = None
            else:
                details_dict['name'] = None
                details_dict['production_years'] = None

            production_years_text_pattern = r'Production years:\s*([^<]+)'
            production_years_text_matches = self.parser(production_years_text_pattern, html_content)
            if production_years_text_matches:
                if not details_dict['production_years']: 
                    details_dict['production_years'] = production_years_text_matches[0].strip()
                else: 
                    current_years = details_dict['production_years'].split(', ')
                    new_years = production_years_text_matches[0].strip().split(', ')
                    combined_years = sorted(list(set(current_years + new_years)))
                    details_dict['production_years'] = ", ".join(combined_years)


            image_pattern = r'<img.*?src="([^"]*main\.jpg)".*?>'
            image_matches = self.parser(image_pattern, html_content)
            details_dict['image_url'] = image_matches[0] if image_matches else None
            
            engine_pattern = r'<p class="engitm subtlesep_top"><a href="[^"]+" class="engurl semibold" title="[^"]+">.*?<span class="col-green2">([^<]+)</span></a></p>'
            engine_matches = self.parser(engine_pattern, html_content)
            details_dict['engines'] = [engine.strip() for engine in engine_matches] if engine_matches else []

            other_details_pattern = r'<strong>(Body style|Segment):<\/strong>\s*([^<]*)'
            other_details_matches = self.parser(other_details_pattern, html_content)
            for key, value in other_details_matches:
                details_dict[key.replace(' ', '_').lower()] = value.strip()

            # Extract car description
            description_pattern = r'<div class="newstext">\s*(.*?)\s*</div>'
            description_matches = self.parser(description_pattern, html_content)
            details_dict['description'] = description_matches[0].strip() if description_matches else None

            all_car_details.append(details_dict)

        return all_car_details

    def scrape_car_images(self, html_content: str) -> list[str]:
        """
        Scrapes all car image URLs from the given HTML content.
        """
        image_pattern = r'<img.*?src="([^"]+\.jpg)".*?>'
        image_matches = self.parser(image_pattern, html_content)
        return image_matches
    
    def scrape_news_text(self, html_content: str) -> list[str]:
        news_pattern = r'<div class="newstext">(.*?)</div>'
        news_matches = self.parser(news_pattern, html_content, re.DOTALL)
        
        cleaned_news = []
        for news_html in news_matches:
            # Remove <br> tags
            text = re.sub(r'<br\s*/?>', ' ', news_html)
            # Remove any other HTML tags
            text = re.sub(r'<[^>]+>', '', text)
            # Replace multiple spaces with a single space and strip whitespace
            text = re.sub(r'\s+', ' ', text).strip()
            if text:
                cleaned_news.append(text)
                
        return cleaned_news