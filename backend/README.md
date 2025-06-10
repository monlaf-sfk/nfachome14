# FastAPI Boilerplate with Docker, PostgreSQL, and Alembic

## Features

- FastAPI application structure
- PostgreSQL database
- Alembic for migrations
- Dockerized setup
- Modular code organization

## Project Structure

```
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py
│   ├── routers
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   ├── crud
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── user.py
│   ├── schemas
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── user.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── user.py
│   ├── external_services
│   │   ├── __init__.py
│   │   ├── email.py
│   │   └── notification.py
│   └── utils
│       ├── __init__.py
│       ├── authentication.py
│       └── validation.py
├── tests
│   ├── __init__.py
│   ├── test_main.py
│   ├── test_items.py
│   └── test_users.py
├── requirements.txt
├── .gitignore
├── alembic.ini
├── alembic/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-directory>
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following content:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/app_db
```

### 3. Build and Run with Docker Compose

```bash
docker-compose up --build
```

- FastAPI will be available at `http://localhost:8000`
- Swagger docs at `http://localhost:8000/docs`

### 4. Database Migrations

To create a new migration:

```bash
docker-compose run backend alembic revision --autogenerate -m "Migration message"
```

To apply migrations:

```bash
docker-compose run backend alembic upgrade head
```

### 5. Running Tests

```bash
docker-compose run backend pytest
```

## License

MIT
