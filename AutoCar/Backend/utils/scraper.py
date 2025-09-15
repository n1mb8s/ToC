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
