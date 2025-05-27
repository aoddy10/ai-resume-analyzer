FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY ./app /code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]