# Recipe Explorer Application

## Overview

Recipe Explorer is a full-stack web application that allows users to browse, search, and filter recipes from a database. The application features a responsive UI with sorting, pagination, and detailed recipe views.

Detailed Documentation Link - https://docs.google.com/document/d/1cUKnjppWbUrAg1tYPQ252JvMGMw-fm23bplrYKiypu0/edit?tab=t.0

## Project Structure

```
recipe-explorer/
├── .env                 # Environment variables 
├── .venv/               # Python virtual environment 
├── __pycache__/         # Python cache files 
├── alembic/             # Database migration files
│   ├── versions/        # Migration version files
│   ├── env.py           # Alembic environment configuration
│   ├── README           # Alembic README
│   └── script.py.mako   # Migration script template
├── alembic.ini          # Alembic configuration file
├── app/                 # Application code
│   ├── __pycache__/     # Python cache files 
│   ├── api/             # API endpoints
│   │   ├── recipes.py   # Recipe data loading endpoints
│   │   └── routes.py    # Recipe query endpoints
│   ├── crud/            # Database CRUD operations
│   │   └── recipe_crud.py # Recipe CRUD operations
│   ├── db/              # Database configuration
│   │   ├── base.py      # SQLAlchemy base configuration
│   │   └── session.py   # Database session management
│   ├── logs/            # Application logs
│   │   └── data_load.log # Data loading logs
│   ├── models/          # SQLAlchemy models
│   │   └── recipe.py    # Recipe model
│   ├── schemas/         # Pydantic schemas
│   │   └── recipe.py    # Recipe schema
│   └── config.py        # Application configuration
├── data/                # Recipe data files 
│   └── recipes.json     # Recipe JSON data
├── frontend/            # Frontend code
│   ├── index.html       # Main HTML file
│   ├── scripts.js       # JavaScript code
│   └── styles.css       # CSS styles
├── main.py              # FastAPI application entry point
└── requirements.txt     # Python dependencies
```

## Technology Stack

### Backend
- **Python 3.9+**
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **PostgreSQL** - Relational database
- **Pydantic** - Data validation and settings management

### Frontend
- **HTML/CSS/JavaScript** - Frontend stack


## Development Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- Node.js (for frontend development tools)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Sakthisree-26/securin-recipe.git
   cd securin_recipe
   ```

2. Create and activate virtual environment
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file with database configuration
   ```
   DATABASE_URL=postgresql+psycopg2://username:password@localhost/recipe_data
   ```

5. Run database migrations
   ```bash
   alembic upgrade head
   ```

6. Start the application
   ```bash
   uvicorn main:app --reload
   ```

7. Access the application at `http://localhost:8000/frontend/index.html`

## Data Loading

To load recipe data into the database:

1. Place your recipe JSON file in the `data` directory
2. Make a POST request to `/api/load_recipes/`

Example using curl:
```bash
curl -X POST "http://localhost:8000/api/load_recipes/" -H "accept: application/json"
```


## Key Features

- **Recipe Database** - Store and manage recipe data in PostgreSQL
- **API Layer** - RESTful API for querying recipes
- **Search & Filtering** - Filter recipes by title, cuisine, rating, time, and calories
- **Sorting** - Sort recipes by various attributes
- **Pagination** - Navigate through large result sets
- **Responsive UI** - Works on desktop and mobile devices
- **Recipe Details** - Detailed view of recipe information
- **Data Loading** - API endpoint for loading recipe data

## Implementation Details

### Database Schema

The application uses a PostgreSQL database with the following schema for recipes:

```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    cuisine VARCHAR,
    title VARCHAR NOT NULL,
    rating FLOAT,
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,
    description TEXT,
    nutrients JSONB,
    serves VARCHAR
);
```

### API Endpoints

- **GET /api/recipes** - Get paginated recipes with sorting
- **GET /api/recipes/search** - Search recipes with filters
- **POST /api/load_recipes/** - Load recipe data from JSON file

### Frontend Features

- **Responsive Table** - Display recipes in a sortable, responsive table
- **Filter Panel** - Multiple filter options for finding specific recipes
- **Detail Drawer** - Sliding drawer for viewing detailed recipe information
- **Pagination Controls** - Navigate through pages of recipes
- **Loading States** - Visual feedback during data loading
- **Error Handling** - Graceful handling of API errors



## Author

Sakthisree Moliyan Vel - [sakthisreemvel@gmail.com](mailto:sakthisremvel@gmail.com)