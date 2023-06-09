import { NextFunction, Request, Response } from "express";
import { ApiKey } from "../api.key/api.key.entity";
import logger from "../common/logger";
import { unauthorized } from "../common/response";
import { base64ToString } from "../common/string";
import { Database } from "../database";

const ApiKeyRepository = Database.getRepository(ApiKey)

export default async function (req: Request, res: Response, next: NextFunction) {
	logger.debug('authorization')
	const { authorization } = req.headers

	const [bearer, string] = (authorization as string).split(' ')
	if (!string) {
		logger.debug('no auth string found')
		return unauthorized(res)
	}

	const { "api-key": apiKey, "api-key-user": apiKeyUser, username, token } = JSON.parse(base64ToString(string))
	if (!apiKey) {
		logger.debug('no apiKey found')
		return unauthorized(res)
	}

	const apiKeys = await ApiKeyRepository.findOneBy({ usedBy: apiKeyUser })
	if (!apiKeys && !apiKey.compareTokenSync(apiKey)) {
		logger.debug('no api key match found')
		unauthorized(res)
	}


	res.locals.username = username
	res.locals.token = token
	next()
}
