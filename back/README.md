# Timesphere Bakend

## Environment Setup

To create a local environment and run the backend (within the `back` directory):

- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`
- `uvicorn app.api.server:app --reload`

After the initial setup you'll just need to activate the virtual environment and run the server in future:
`source venv/bin/activate`

To exit the virtual environment:
`deactivate`

## Container

To build:
`docker build -t timesphere-backend:latest .`

To run:
`docker run -d -p 8000:80 timesphere-backend:latest`
