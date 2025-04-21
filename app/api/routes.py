from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.recipe import RecipeSchema
from app.crud import recipe_crud
from typing import Optional

router = APIRouter()

@router.get("/api/recipes")
def get_all_recipes(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    sort_field: Optional[str] = Query("rating"),
    sort_order: Optional[str] = Query("desc")
):
    result = recipe_crud.get_all_recipes(
        db=db,
        page=page,
        limit=limit,
        sort_field=sort_field,
        sort_order=sort_order
    )
    return result


@router.get("/api/recipes/search", response_model=dict)
def search_recipes(
    title: str = None,
    cuisine: str = None,
    rating: str = None,
    total_time: str = None,
    calories: str = None,
    db: Session = Depends(get_db)
):
    filters = {}
    if title:
        filters['title'] = title
    if cuisine:
        filters['cuisine'] = cuisine
    if rating:
        filters['rating'] = rating
    if total_time:
        filters['total_time'] = total_time
    if calories:
        filters['calories'] = calories  

    total, results = recipe_crud.search_recipes(db, filters)
    result_list = [RecipeSchema.from_orm(recipe) for recipe in results]

    return {
        "total": total,
        "data": result_list
    }
