# Backend Dockerfile - Python FastAPI
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY src/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Expose the port
EXPOSE 3001

# Run the application
CMD ["python", "-m", "src.main"]

