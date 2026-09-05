import winston from "winston";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: combine(timestamp(), errors({ stack: true }), json()),
	transports: [
		new winston.transports.Console({
			format:
				process.env.NODE_ENV === "production"
					? combine(timestamp(), errors({ stack: true }), json())
					: combine(colorize(), timestamp(), errors({ stack: true }), simple()),
		}),
	],
	exitOnError: false,
});

export { logger };
