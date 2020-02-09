import { get } from 'lodash';
import pino, { Logger } from 'pino';

/** default pino levels:
 *  off   100 ("silent")
 *  fatal 60
 *  error 50
 *  warn  40
 *  info	30
 *  debug 20
 *  trace 10
 */

const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'test' ? 'silent' : 'info';

const logger: Logger = pino({
  name: get(process, 'env.APP_ID', 'NO_APP_DEFINED'),
  level: get(process, 'env.LOG_LEVEL', DEFAULT_LOG_LEVEL),
  customLevels: {
    audit: 70,
  },
  useLevelLabels: true,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export default logger;
