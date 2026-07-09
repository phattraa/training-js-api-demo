# Python Project Details

A modern Python/FastAPI microservice API that provides access to university and school data.

## Features

- RESTful API endpoints for querying school data
- Async/await for non-blocking I/O operations
- Comprehensive error handling with custom exception classes
- Input validation for GUID parameters
- Structured logging with Python's logging module
- Health check endpoint
- Environment variable configuration with Pydantic Settings
- Type hints throughout the codebase
- Comprehensive test suite with pytest
- Data caching for improved performance
- Path validation to prevent directory traversal attacks

## Prerequisites

- Python >= 3.8
- pip (Python package manager)

## Installation

1. Install dependencies:

```bash
make development
make setup
```

Or manually:

```bash
pip install --upgrade pip
pip install --requirement development-requirements.txt
pip install --requirement requirements.txt
```

## Configuration

The application can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Host address for the server to listen on |
| `PORT` | `3000` | Port number for the server to listen on |
| `RELOAD` | `false` | Enable auto-reload for development |
| `DATA_FILE_PATH` | `data.json` | Path to the JSON data file |
| `API_TITLE` | `Python API Microservice` | API title for OpenAPI documentation |
| `API_VERSION` | `1.0.0` | API version |
| `API_DESCRIPTION` | `A FastAPI microservice for serving JSON data` | API description |

## Running the Application

### Development Mode (with auto-reload)

```bash
make run
```

Or manually:

```bash
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 3000
```

The server will start on the configured port (default: 3000).

## API Endpoints

### Health Check

|Route|Description|Status Code|
|-----|-----------|-----------|
|**GET** `/health`|Returns the health status of the service.|`200 OK`|

**Response (Healthy):**
```json
{
  "status": "healthy",
  "data_items": "51"
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "error": "Data file cannot be loaded"
}
```

### Get All Data

|Route|Description|Status Code|
|-----|-----------|-----------|
|**GET** `/`|Returns all school/university data.|`200 OK`|

**Response:**

```json
[
  {
    "guid": "05024756-765e-41a9-89d7-1407436d9a58",
    "school": "Iowa State University",
    "mascot": "Cy the Cardinal",
    "nickname": "Cyclones",
    "location": "Ames, IA, USA",
    "latlong": "42.026111,-93.648333",
    "ncaa": "Division I",
    "conference": "Big 12 Conference"
  },
  ...
]
```

### Get Item by GUID

|Route|Description|Status Code|
|-----|-----------|-----------|
|**GET** `/{guid}`|Returns a single school/university item by GUID. Parameters: `guid` (path parameter) - GUID string identifier|`200 OK`, `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`|

**Parameters:**

- `guid` (path parameter) - GUID string identifier

**Response (Success):**

```json
{
  "guid": "05024756-765e-41a9-89d7-1407436d9a58",
  "school": "Iowa State University",
  "mascot": "Cy the Cardinal",
  "nickname": "Cyclones",
  "location": "Ames, IA, USA",
  "latlong": "42.026111,-93.648333",
  "ncaa": "Division I",
  "conference": "Big 12 Conference"
}
```

**Response (Not Found):**

```json
{
  "detail": "Item with GUID '00000000-0000-0000-0000-000000000000' not found"
}
```

**Response (Invalid GUID Format):**

```json
{
  "detail": "GUID cannot be empty"
}
```

**Response (Data Load Error):**

```json
{
  "detail": "Failed to load data: Data file not found: /nonexistent/file.json"
}
```

## Error Responses

All error responses follow FastAPI's standard error format:

```json
{
  "detail": "Error description"
}
```

FastAPI automatically generates OpenAPI/Swagger documentation available at `/docs` and `/redoc` endpoints.

## Testing

### Run Tests

```bash
make test
```

Or manually:

```bash
python -m pytest --verbose --junit-xml=junit.xml
```

### Run Tests in Watch Mode

```bash
pytest-watch
```

### Test Coverage

The test suite includes:

- Health check endpoint tests
- Data retrieval tests
- Error handling tests (404, 400, 500)
- Input validation tests
- Edge case tests (empty files, missing files, invalid JSON)
- Data caching tests
- Configuration tests

Test results are output to `junit.xml` for CI/CD integration.

## Code Quality

### Formatting

Check code formatting:

```bash
make fmt
```

Or manually:

```bash
black --check --diff *.py
```

### Linting

Check code style:

```bash
make lint
```

Or manually:

```bash
flake8 --max-line-length=88 --ignore=E203,W503
```

### Clean Build Artifacts

```bash
make clean
```

This removes:
- `__pycache__` directories
- `.pyc` files
- `.pytest_cache` directories
- `junit.xml` test results
- Coverage files

## Project Structure

```bash
.
├── main.py                    # Main application file
├── main_test.py               # Test suite
├── config.py                  # Configuration management
├── data.json                  # Data file
├── requirements.txt           # Production dependencies
├── development-requirements.txt  # Development dependencies
├── Makefile                   # Build and test commands
├── pyproject.toml             # Project configuration (black, pytest, flake8)
├── .env.example               # Example environment configuration (if exists)
└── README.md                  # Project README
```

## Code Quality Features

- **Type Hints**: Comprehensive type annotations throughout the codebase
- **Async I/O**: Uses FastAPI's async capabilities for non-blocking operations
- **Error Handling**: Custom exception classes with proper error propagation
- **Input Validation**: GUID validation and path validation to prevent security issues
- **Separation of Concerns**: Configuration, data loading, and API routes are separated
- **Environment Configuration**: Configurable via environment variables with Pydantic Settings
- **Logging**: Structured logging with Python's logging module
- **Data Caching**: In-memory caching with file path tracking for performance
- **Lifespan Events**: Modern FastAPI lifespan context manager for startup/shutdown
- **Path Security**: Directory traversal attack prevention
- **OpenAPI Documentation**: Automatic API documentation generation

## Development

### Code Style

The project uses:
- **Black**: Code formatter (line length: 88)
- **Flake8**: Linter (with E203, W503 ignored for Black compatibility)
- **Pytest**: Testing framework with async support

### Adding New Endpoints

1. Create a route handler function with proper type hints
2. Add docstrings following Google/NumPy style
3. Add the route to the app
4. Add tests for the new endpoint
5. Update this documentation with API details

### Running Individual Commands

```bash
# Setup development environment
make development

# Install production dependencies
make setup

# Format code
make fmt

# Lint code
make lint

# Run tests
make test

# Run application
make run

# Clean build artifacts
make clean

# Run all checks
make all
```

## Troubleshooting

### Port Already in Use

If you get an error that the port is already in use:

1. Change the `PORT` in your `.env` file or environment
2. Or stop the process using the port:
   ```bash
   lsof -ti:3000 | xargs kill
   ```

### Data File Not Found

Ensure `data.json` exists in the project root or update `DATA_FILE_PATH` in your `.env` file or environment variables.

### Tests Failing

Make sure:

1. Dependencies are installed: `make development && make setup`
2. The server can start successfully
3. Test data files are accessible
4. Cache is cleared: The `reset_cache` fixture should handle this automatically

### Import Errors

If you encounter import errors:

1. Ensure you're in a virtual environment
2. Install dependencies: `make development && make setup`
3. Check that Python can find the modules: `python -c "import main; import config"`

### FastAPI Deprecation Warnings

The project uses modern FastAPI lifespan events instead of deprecated `on_event` handlers. If you see deprecation warnings, ensure you're using the latest version of the code.

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at `http://localhost:3000/docs`
- **ReDoc**: Available at `http://localhost:3000/redoc`
- **OpenAPI JSON**: Available at `http://localhost:3000/openapi.json`

These endpoints provide interactive documentation where you can test API endpoints directly from your browser.
