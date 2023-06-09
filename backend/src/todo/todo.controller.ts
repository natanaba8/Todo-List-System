import { Request, Response } from "express";
import logger from "../common/logger";
import { goodRequest, noGoodRequest } from "../common/response";
import { Database } from "../database";
import { Todo } from "./todo.entity";

const TodoRepository = Database.getRepository(Todo)

class TodoController {
	async getMyTodos(req: Request, res: Response) {
		logger.debug('get my todos')
		const { user } = res.locals

		const todos = await TodoRepository
			.createQueryBuilder('todo')
			.leftJoinAndSelect('todo.user', 'user')
			.where('user.id = :userId', { userId: user.id })
			.orderBy('todo.timestamp', 'DESC')
			.getMany();

		goodRequest(res, ['list', todos])
	}

	async createTodo(req: Request, res: Response) {
		logger.debug('create todo')
		
		if (!req.body.text) return noGoodRequest(res, 'todo body can\'t be empty')
		
		const newTodo = new Todo()
		newTodo.text = req.body.text
		newTodo.user = res.locals.user

		await TodoRepository.save(newTodo)

		goodRequest(res)
	}

	async toggleDone(req: Request, res: Response) {
		logger.debug('toggle done')

		const theItem = await TodoRepository.findOneBy({ id: req.body.id })
		if (!theItem) return noGoodRequest(res, 'no item found')

		theItem.done = req.body.done

		await TodoRepository.save(theItem)

		goodRequest(res)
	}

	async deleteItem(req: Request, res: Response) {
		logger.debug('delete item')

		const theItem = await TodoRepository.findOneBy({ id: req.body.id })
		if (!theItem) return noGoodRequest(res, 'no item found')

		await TodoRepository.remove(theItem)

		goodRequest(res)
	}
}

export default new TodoController()