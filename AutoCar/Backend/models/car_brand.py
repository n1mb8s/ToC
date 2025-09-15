from pydantic import BaseModel

class CarBrand(BaseModel):
    site_url: str
    name: str
    image_url: str