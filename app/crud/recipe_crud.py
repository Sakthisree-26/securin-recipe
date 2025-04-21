from sqlalchemy.orm import Session
from sqlalchemy import asc, desc, func,cast,Float
from app.models.recipe import Recipe
from fastapi import HTTPException

def get_all_recipes(db: Session, page: int = 1, limit: int = 10, sort_field: str = "rating", sort_order: str = "desc"):
    valid_sort_fields = ['rating', 'prep_time', 'cook_time', 'total_time']
    valid_sort_orders = ['asc', 'desc']

    if sort_field not in valid_sort_fields:
        raise HTTPException(status_code=422, detail=f"Invalid sort field '{sort_field}'. Choose from {valid_sort_fields}")

    if sort_order not in valid_sort_orders:
        raise HTTPException(status_code=422, detail=f"Invalid sort order '{sort_order}'. Choose 'asc' or 'desc'")

    # Total recipe count
    total = db.query(Recipe).count()
    

    # Pagination
    recipes = (
        db.query(Recipe)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
   

    # Sorting 
    def get_sort_value(recipe):
        return getattr(recipe, sort_field) if getattr(recipe, sort_field) is not None else 0

    reverse = sort_order == "desc"
    sorted_recipes = sorted(recipes, key=get_sort_value, reverse=reverse)

    
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": sorted_recipes
    }

#searching
def search_recipes(db: Session, filters: dict):
    query = db.query(Recipe)
    print(f"Initial query created")

    if 'title' in filters:
        print(f"Filtering title with value: {filters['title']}")
        query = query.filter(Recipe.title.ilike(f"%{filters['title']}%"))

    if 'cuisine' in filters:
        cuisines = filters['cuisine'].split(",")
        print(f"Filtering cuisine with values: {cuisines}")
        query = query.filter(Recipe.cuisine.in_(cuisines))

    if 'rating' in filters:
        for cond in filters['rating'].split(","):
            try:
                op, value = cond.split(":")
                value = float(value)
                print(f"Filtering rating with condition: {op} {value}")
                if op == "gte":
                    query = query.filter(Recipe.rating >= value)
                elif op == "lte":
                    query = query.filter(Recipe.rating <= value)
                else:
                    print(f"Invalid rating operator: {op}")
            except ValueError:
                print(f"Invalid rating filter format: {cond}")

    if 'total_time' in filters:
        for cond in filters['total_time'].split(","):
            try:
                op, value = cond.split(":")
                value = int(value)
                print(f"Filtering total_time with condition: {op} {value}")
                if op == "gte":
                    query = query.filter(Recipe.total_time >= value)
                elif op == "lte":
                    query = query.filter(Recipe.total_time <= value)
                else:
                    print(f"Invalid total_time operator: {op}")
            except ValueError:
                print(f"Invalid total_time filter format: {cond}")

    if 'calories' in filters:
     for cond in filters['calories'].split(","):
        try:
            op, value = cond.split(":")
            value = float(value)
            print(f"Filtering calories with condition: {op} {value}")
            if op == "gte":
                query = query.filter(cast(Recipe.nutrients.op("->>")("calories"), Float) >= value)
            elif op == "lte":
                query = query.filter(cast(Recipe.nutrients.op("->>")("calories"), Float) <= value)
            
            else:
                print(f"Invalid calories operator: {op}")
        except ValueError:
            print(f"Invalid calories filter format: {cond}")
    
   

    total = query.count()
    print(f"Total records found: {total}")

    results = query.all()
    print(f"Fetched {len(results)} records after filtering")

    return total, results