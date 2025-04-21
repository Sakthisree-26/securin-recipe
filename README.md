🍳 Securin -  Recipe Assessment 

To parse a JSON file that contains recipes, store it in a database , and develop an api to expose that data in an interactive webpage. The API should allow for  pagination, sorting, and searching the recipe records based on various filters. 

Documentation Link : https://docs.google.com/document/d/1cUKnjppWbUrAg1tYPQ252JvMGMw-fm23bplrYKiypu0/edit?usp=sharing

🧰 Tech Stack

FastAPI

PostgreSQL

SQLAlchemy

Alembic

Swagger UI


🛠️ Setup Instructions (Local Development)

Ensure you have Python  and PostgreSQL installed on your machine.

1. Clone the Repository

git clone https://github.com/Sakthisree-26/securin-recipe.git
cd securin-recipe

2. Create & Activate Virtual Environment

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install Dependencies

pip install -r requirements.txt

4. Configure .env File

Create a .env file in the root directory and add your PostgreSQL credentials:

DATABASE_URL=postgresql://username:password@localhost:5432/dbname

Replace username, password, and dbname with your PostgreSQL credentials.

Run Migrations with Alembic

1. Initialize Alembic (Skip if already done)

alembic init alembic

2. Create a Migration Script

alembic revision --autogenerate -m "Initial migration"

3. Apply Migrations

alembic upgrade head

Run the Application

uvicorn main:app --reload

This will start the server on:

http://127.0.0.1:8000

Swagger UI

You can explore and test the API using the built-in Swagger UI:

http://127.0.0.1:8000/docs

Or use ReDoc:

http://127.0.0.1:8000/redoc

📁 Project Structure

securin-recipe/
│
├── alembic/                 # Alembic migrations
├── app/
│   ├── __init__.py
|   |__ api/
|   |__
│   ├── main.py              # FastAPI application
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routes/              # API routes
│   └── database.py          # DB connection
│
├── .env                     # Environment variables
├── alembic.ini              # Alembic config
├── requirements.txt         # Python dependencies
└── README.md                # You're reading it!





🧑‍💻 Author

Sakthisree Moliyan VelGitHub: @Sakthisree-26

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

