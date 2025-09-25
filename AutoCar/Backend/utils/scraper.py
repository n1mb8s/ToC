import re
import json
import cloudscraper
from typing import Any
from pathlib import Path
from Backend.config import CRAWLER_ENDPOINT, CRAWLER_HEADERS


class Scraper:
    def __init__(self, cache_file: str = "scraper_cache.json"):
        self.cache_file = Path(cache_file)
        self.scraper = cloudscraper.create_scraper()

        # โหลด cache จากไฟล์ถ้ามี
        if self.cache_file.exists():
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self.__cache = json.load(f)
            except Exception:
                self.__cache = {}
        else:
            self.__cache = {}

    def _save_cache(self):
        """บันทึก cache ลงไฟล์"""
        with open(self.cache_file, "w", encoding="utf-8") as f:
            json.dump(self.__cache, f, ensure_ascii=False, indent=2)

    def find(
        self,
        pattern: str,
        url_path: str,
        cache=True,
        flags=re.DOTALL | re.IGNORECASE,
    ) -> list[Any]:
        """
        ถ้า url_path ไม่มีใน cache → ไปโหลดจากเว็บ
        ถ้ามีแล้ว → ใช้ cache ทันที
        """
        if not cache or (url_path not in self.__cache):
            url = f"{CRAWLER_ENDPOINT}/{url_path}"
            response = self.scraper.get(url, headers=CRAWLER_HEADERS)

            if response.status_code != 200:
                raise Exception(f"Failed to get {url_path}, status {response.status_code}")

            # เก็บ HTML ของ path นี้ลง cache
            self.__cache[url_path] = response.text
            self._save_cache()
        else:
            print(f"[CACHE] use html for {url_path}")

        raw_html = self.__cache[url_path]
        matches = re.findall(pattern, raw_html, flags=flags)
        return matches

    def get_raw_html(self, url_path: str) -> str | None:
        return self.__cache.get(url_path)

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

            all_car_details.append(details_dict)

        return all_car_details

    def scrape_car_images(self, html_content: str) -> list[str]:
        """
        Scrapes all car image URLs from the given HTML content.
        """
        image_pattern = r'<img.*?src="([^"]+\.jpg)".*?>'
        image_matches = self.parser(image_pattern, html_content)
        return image_matches
