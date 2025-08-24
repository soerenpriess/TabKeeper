/**
 * Custom logging utility with timestamps for TabKeeper
 * Provides consistent logging across the application with timestamps
 */

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// Current log level (can be configured)
let currentLogLevel = LOG_LEVELS.DEBUG

/**
 * Formats a timestamp for logging
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  const now = new Date()
  return now.toISOString().replace('T', ' ').slice(0, 23)
}

/**
 * Formats a log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments
 * @returns {Array} Formatted log arguments
 */
function formatLogMessage(level, message, ...args) {
  const timestamp = getTimestamp()
  const prefix = `[${timestamp}] [${level}]`
  return [prefix, message, ...args]
}

/**
 * Custom logger composable
 * @returns {Object} Logger functions
 */
export function useLogger() {
  
  /**
   * Log debug messages
   * @param {string} message - Debug message
   * @param {...any} args - Additional arguments
   */
  function debug(message, ...args) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(...formatLogMessage('DEBUG', message, ...args))
    }
  }

  /**
   * Log info messages
   * @param {string} message - Info message
   * @param {...any} args - Additional arguments
   */
  function info(message, ...args) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.log(...formatLogMessage('INFO', message, ...args))
    }
  }

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {...any} args - Additional arguments
   */
  function warn(message, ...args) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(...formatLogMessage('WARN', message, ...args))
    }
  }

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {...any} args - Additional arguments
   */
  function error(message, ...args) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(...formatLogMessage('ERROR', message, ...args))
    }
  }

  /**
   * Set the minimum log level
   * @param {string} level - Log level ('DEBUG', 'INFO', 'WARN', 'ERROR')
   */
  function setLogLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      currentLogLevel = LOG_LEVELS[level]
    }
  }

  return {
    debug,
    info,
    warn,
    error,
    setLogLevel
  }
}