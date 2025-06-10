FROM python:3.10-slim

WORKDIR /app

# Set environment variables to prevent Python from buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies if any (e.g., for psycopg2 if not using -binary)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt

COPY ./src /app/src
COPY .env /app/.env  

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# The CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
# is often preferred, but for reload during development, this can be useful:
CMD ["uvicorn", "src.main:app", "--host", "localhost", "--port", "8000", "--reload"]