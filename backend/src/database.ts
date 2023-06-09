import 'dotenv/config'
import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApiKey } from "./api.key/api.key.entity";
import { Todo } from "./todo/todo.entity";
import { User } from "./user/user.entity";
import { UserSession } from "./user/user.session.entity";

export const Database = new DataSource({
	type: 'mysql',
	username: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'todo',
	host: 'localhost',
	port: 3306,
	entities: [ ApiKey, User, UserSession, Todo ],
	synchronize: true,
	dropSchema: false,
})
