# Timesphere Backend

## Environment Setup

To create a local environment and run the backend (within the `back` directory):

- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`
- `uvicorn api.main:app --reload`

After the initial setup you'll just need to activate the virtual environment and run the server in future:
`source venv/bin/activate`

To exit the virtual environment:
`deactivate`

## Testing

There are several custom VSCode tasks for testing. You can run these tasks by pressing `Ctrl+Shift+P` or `Cmd+Shift+P` and typing `Tasks: Run Task`.

## Extensions

Install `basedpyright` for type checking and `pylint` for linting, make sure they don't throw warnings or your PR wont merge.

## Container

To build:
`docker build -t timesphere-backend:latest .`

To run:
`docker run -d -p 8080:8080 timesphere-backend:latest`

or
`./build.sh`
