from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the new async table creation function and Base
from src.database import create_db_and_tables, Base

# Import routers
from src.users import router as user_router
from src.tasks import router as task_router
from src.auth import router as auth_router
from src.assistant import router as assistant_router

# Import models to ensure they are registered with Base.metadata before table creation
# This is crucial if your models are defined in different files but share the same Base
from src.users import models as user_models # noqa F401 - Tell linters it's used
from src.tasks import models as task_models # noqa F401 - Tell linters it's used

from src.core.config import settings

app = FastAPI(title="Task Management API")

@app.on_event("startup")
async def on_startup():
    # Create database tables asynchronously
    # Ensure all models inheriting from src.database.Base are created.
    await create_db_and_tables()

# --- CORS Configuration ---
origins = [
    settings.frontend_url,
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:80",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(task_router.router)
app.include_router(assistant_router.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Task Management API!"}
