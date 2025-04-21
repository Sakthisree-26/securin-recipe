from pydantic import BaseModel
from typing import Optional, Dict

class RecipeSchema(BaseModel):
    id: int
    title: str
    cuisine: Optional[str]
    rating: Optional[float]
    prep_time: Optional[int]
    cook_time: Optional[int]
    total_time: Optional[int]
    description: Optional[str]
    nutrients: Optional[Dict]
    serves: Optional[str]

    class Config:
        #orm_mode = True
        from_attributes = True 