FROM python:3.12.4-alpine

EXPOSE 5000
WORKDIR /app

COPY requirements.txt .

RUN pip install uv
RUN uv pip install -r requirements.txt --system

CMD ["python3", "-m", "src"]
