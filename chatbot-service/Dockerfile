FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

RUN addgroup --system skillforge \
    && adduser --system --ingroup skillforge skillforge
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=skillforge:skillforge app ./app

USER skillforge
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
