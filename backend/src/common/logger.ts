import 'dotenv/config'
import { createLogger, format, transports } from 'winston'

const { combine, printf, timestamp, colorize } = format

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'debug',
	transports: [
		new transports.Console()
	],
	format: combine(
		colorize(),
		timestamp(),
		printf(log => `${new Date(log.timestamp).toLocaleString()} [${log.level}] - ${log.message}`)
	)
})

export default logger