FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


COPY requirements.txt .
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt

COPY ./src /app/src
COPY .env /app/.env  

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "localhost", "--port", "8000", "--reload"]