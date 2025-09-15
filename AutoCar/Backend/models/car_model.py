from pydantic import BaseModel

class CarModel(BaseModel):
    image_url: str
    brand_url: str
    name: str

