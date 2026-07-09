# Javascript Project Details

A modern JavaScript/Node.js microservice API that provides access to university and school data.

## Features

- RESTful API endpoints for querying school data
- Async/await for non-blocking I/O operations
- Comprehensive error handling with custom error classes
- Input validation for GUID parameters
- Structured logging with Winston
- Health check endpoint
- Request ID tracking for debugging
- Environment variable configuration
- Comprehensive test suite

## Prerequisites

- Node.js >= 14.0.0
- npm (comes with Node.js)

## Installation

1. Install dependencies:

```bash
npm install
```

1. Copy the example environment file:

```bash
cp .env.example .env
```

1. (Optional) Edit `.env` to customize configuration:

```bash
PORT=3000
DATA_FILE_PATH=data.json
LOG_LEVEL=info
```

## Configuration

The application can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port number for the server to listen on |
| `DATA_FILE_PATH` | `data.json` | Path to the JSON data file |
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) |

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on the configured port (default: 3000).

## API Endpoints

### Health Check

|Route|Description|Status Code|
|-----|-----------|-----------|
|**GET** `/health`|Returns the health status of the service.|`200 OK`|

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
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
|**GET** `/:guid`|Returns a single school/university item by GUID. Parameters: `guid` (path parameter) - Valid UUID v4 format GUID|`200 OK`, `404 Not Found`, `400 Bad Request`|

**Parameters:**

- `guid` (path parameter) - Valid UUID v4 format GUID

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
  "error": {
    "message": "Item not found: 00000000-0000-0000-0000-000000000000",
    "statusCode": 404,
    "requestId": "1234567890-abc123"
  }
}
```

**Response (Invalid GUID Format):**

```json
{
  "error": {
    "message": "Invalid GUID format: invalid-guid",
    "statusCode": 400,
    "requestId": "1234567890-abc123"
  }
}
```

## Error Responses

All error responses follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "requestId": "unique-request-id"
  }
}
```

All responses include an `X-Request-ID` header for request tracking.

## Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

The test suite includes:

- Health check endpoint tests
- Data retrieval tests
- Error handling tests (404, 400)
- Input validation tests
- Edge case tests
- Response header validation

Test results are output to `junit.xml` for CI/CD integration.

## Linting

### Check Code Style

```bash
npm run lint
```

### Auto-fix Linting Issues

```bash
npm run lint -- --fix
```

## Project Structure

```bash
.
├── main.js              # Main application file
├── main_test.js         # Test suite
├── data.json            # Data file
├── package.json         # Dependencies and scripts
├── .env.example         # Example environment configuration
└── README.md            # This file
```

## Code Quality Features

- **Async I/O**: Uses `fs.promises` for non-blocking file operations
- **Error Handling**: Centralized error handling middleware with custom error classes
- **Input Validation**: GUID format validation using regex
- **Separation of Concerns**: Routes, handlers, and middleware are separated
- **Environment Configuration**: Configurable via environment variables
- **Logging**: Structured logging with Winston
- **Request Tracking**: Unique request IDs for debugging
- **Graceful Shutdown**: Handles SIGTERM for clean shutdown

## Development

### Code Style

The project uses ESLint with Google's JavaScript style guide. Run `npm run lint` to check code style.

### Adding New Endpoints

1. Create a route handler function
2. Add JSDoc comments
3. Add the route to the app
4. Add tests for the new endpoint
5. Update this README with API documentation

## Troubleshooting

### Port Already in Use

If you get an error that the port is already in use:

1. Change the `PORT` in your `.env` file
2. Or stop the process using the port

### Data File Not Found

Ensure `data.json` exists in the project root or update `DATA_FILE_PATH` in your `.env` file.

### Tests Failing

Make sure:

1. Dependencies are installed: `npm install`
2. The server can start successfully
3. Port 3000 is available (tests use this port)
