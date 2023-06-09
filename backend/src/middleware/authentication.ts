import { NextFunction, Request, Response } from "express";
import logger from "../common/logger";
import { unauthorized } from "../common/response";
import { Database } from "../database";
import { User } from "../user/user.entity";
import { UserSession, UserSessionStatus } from "../user/user.session.entity";

const UserRepository = Database.getRepository(User)
const UserSessionRepository = Database.getRepository(UserSession)

export default async function (req: Request, res: Response, next: NextFunction) {
	logger.debug('authentication')

	const { username, token } = res.locals
	if (!username || !token) {
		logger.debug('no username and token found')
		return unauthorized(res)
	}

	const theUser = await UserRepository.findOneBy({ username: username })
	if (!theUser) {
		logger.debug('no user found')
		return unauthorized(res)
	}

	const sessions = await UserSessionRepository.findBy({ user: { id: theUser.id } })
	let active = false

	sessions.every(session => {
		active = session.compareTokenSync(token) && session.status === UserSessionStatus.Active
		active && (res.locals.userSession = session)
		return !active
	})

	if (active) {
		res.locals.user = theUser
		next()
	} else {
		logger.debug('no active session found')
		unauthorized(res)
	}
}
