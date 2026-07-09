require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const winston = require('winston');
const path = require('path');

// Constants
const DEFAULT_PORT = 3000;
const DEFAULT_DATA_FILE = 'data.json';
const DEFAULT_LOG_LEVEL = 'info';

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Configuration from environment variables
const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);
const DATA_FILE_PATH = process.env.DATA_FILE_PATH || DEFAULT_DATA_FILE;
const LOG_LEVEL = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;

// Configure the logger to write to STDOUT
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple(),
      winston.format((info, opts) => {
        if (info.res) {
          info.message = `${info.message} ${info.res.statusCode}`;
        }
        return info;
      })(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Custom Error Classes
/**
 * Custom error class for resource not found errors
 * @extends {Error}
 */
class NotFoundError extends Error {
  /**
   * Creates a NotFoundError
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HTTP_STATUS.NOT_FOUND;
  }
}

/**
 * Custom error class for validation errors
 * @extends {Error}
 */
class ValidationError extends Error {
  /**
   * Creates a ValidationError
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
  }
}

// GUID validation regex (UUID v4 format)
const GUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid GUID format
 * @param {string} guid - The GUID string to validate
 * @return {boolean} True if valid GUID format
 */
function isValidGuid(guid) {
  return typeof guid === 'string' && GUID_REGEX.test(guid);
}

/**
 * Loads data from JSON file asynchronously
 * @return {Promise<Array>} Promise that resolves to the data array
 * @throws {Error} If file cannot be read or parsed
 */
async function loadData() {
  try {
    const filePath = path.resolve(DATA_FILE_PATH);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    logger.error(`Failed to load data file: ${error.message}`);
    throw new Error(`Failed to load data file: ${error.message}`);
  }
}

// Initialize Express app
const app = express();

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Logging middleware using the logger
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.info(`${res.statusCode} ${req.method} ${req.url} [${req.id}]`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Route handler for GET / - returns all data
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 */
async function getAllData(req, res, next) {
  try {
    const data = await loadData();
    res.status(HTTP_STATUS.OK).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Route handler for GET /:guid - returns a single item by GUID
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 */
async function getItemByGuid(req, res, next) {
  try {
    const guid = req.params.guid;

    // Validate GUID format
    if (!isValidGuid(guid)) {
      throw new ValidationError(`Invalid GUID format: ${guid}`);
    }

    const data = await loadData();
    const item = data.find((item) => item.guid === guid);

    if (!item) {
      throw new NotFoundError(`Item not found: ${guid}`);
    }

    res.status(HTTP_STATUS.OK).json(item);
  } catch (error) {
    next(error);
  }
}

// Define routes
app.get('/', getAllData);
app.get('/:guid', getItemByGuid);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  // Log error with appropriate level
  if (statusCode >= 500) {
    logger.error(`Error [${req.id}]: ${message}`, {error: err.stack});
  } else {
    logger.warn(`Error [${req.id}]: ${message}`);
  }

  // Return consistent error response format
  res.status(statusCode).json({
    error: {
      message: message,
      statusCode: statusCode,
      requestId: req.id,
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: {
      message: `Route not found: ${req.method} ${req.url}`,
      statusCode: HTTP_STATUS.NOT_FOUND,
      requestId: req.id,
    },
  });
});

// Export app for testing
module.exports = app;

// Start server only if this file is run directly (not when required as module)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
}
