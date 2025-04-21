from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.recipe import Recipe
import json
import logging
import os
import math
from typing import Optional

# Initialize logger , logs file in the root 
log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
os.makedirs(log_dir, exist_ok=True)

log_file_path = os.path.join(log_dir, "data_load.log")
logging.basicConfig(
    filename=log_file_path,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function  to handle NaN Values
def is_valid_number(value: Optional[float]) -> Optional[float]:
    try:
        if value is None or (isinstance(value, float) and math.isnan(value)):
            return None
        return float(value)
    except Exception:
        return None

# Load recipe data from JSON and insert into DB
def load_recipes_data(db: Session) -> dict:
    file_path = os.path.join("data", "recipes.json")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, dict):
            logger.error("JSON data is not in the expected format.")
            raise HTTPException(status_code=400, detail="JSON data is not in the expected format.")

        inserted_count = 0

        for recipe_data_item in data.values():
            title = recipe_data_item.get("title")
            if not title:
                continue

            recipe = Recipe(
                cuisine=recipe_data_item.get("cuisine"),
                title=title,
                rating=is_valid_number(recipe_data_item.get("rating")),
                prep_time=is_valid_number(recipe_data_item.get("prep_time")),
                cook_time=is_valid_number(recipe_data_item.get("cook_time")),
                total_time=is_valid_number(recipe_data_item.get("total_time")),
                description=recipe_data_item.get("description"),
                nutrients=recipe_data_item.get("nutrients") if isinstance(recipe_data_item.get("nutrients"), (dict, list)) else None,
                serves=recipe_data_item.get("serves"),
            )

            db.add(recipe)
            inserted_count += 1

        db.commit()
        logger.info(f"Inserted {inserted_count} recipes successfully.")
        return {"message": f"Inserted {inserted_count} recipes."}

    except Exception as e:
        db.rollback()
        logger.error(f"Error inserting recipes: {e}")
        raise HTTPException(status_code=500, detail=f"Error inserting recipes: {e}")

# FastAPI endpoint
@router.post("/load_recipes/")
async def load_recipes(
    db: Session = Depends(get_db),
    local_kw: str = Query("spicy", description="Keyword to filter recipe titles")
):
    logger.info(f"Triggering data load with keyword: {local_kw}")
    return load_recipes_data(db)