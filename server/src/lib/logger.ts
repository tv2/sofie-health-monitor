import { createLogger, transports, format } from 'winston'

const environment = process.env.NODE_ENV || 'local'
const logLevel    = process.env.LOG_LEVEL || (environment === 'local' ? 'info' : 'warn')

const formatConfig = {
  levels: {
    'error': 0,
    'warn':  1,
    'debug': 2,
    'info':  3,
  },
  colors: {
    'error': 'red',
    'warn': 'orange',
    'debug': 'cyan',
  },
}

const logTransports: any = []

// Console transporter
logTransports.push(
  new transports.Console({
    format: format.combine(
      environment === 'local' ?
        format.printf(({ level, message, timestamp, deligate }) => `[${ timestamp }] [${ level }${ deligate ? `:${deligate}` : ''}] ${ message }`) :
        format.json(),
      format.colorize({ all: true, colors: formatConfig.colors }),
    ),
  })
)

const loggerConfiguration = {
  level: logLevel,
  levels: formatConfig.levels,
  format: format.timestamp(),
  transports: logTransports,
}

export const logger = createLogger(loggerConfiguration)
