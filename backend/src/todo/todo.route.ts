import { Application } from "express";
import { RouteConfig } from "../common/route.config";
import authentication from "../middleware/authentication";
import userController from "../user/user.controller";
import todoController from "./todo.controller";

class TodoRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, 'TodoRoutes')
	}

	registerRoute(): Application {
		this.app.use('/api', this.router)

		return this.app
	}
	configureRoutes(): void {
		this.router.route('/todo')
			.get(authentication, todoController.getMyTodos)
			.post(authentication, todoController.createTodo)
			.put(authentication, todoController.toggleDone)
			.delete(authentication, todoController.deleteItem)
	}
}

export default TodoRoute