import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { compareWord, hashWord } from '../common/hash';
import { Todo } from '../todo/todo.entity';
import { UserSession } from './user.session.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	fullname: string;
	
	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	public async setPassword(password: string): Promise<void> {
		this.password = await hashWord(password)
	}

	public async comparePassword(password: string): Promise<boolean> {
		return compareWord(password, this.password)
	}

	@OneToMany(() => UserSession, userSession => userSession.user)
	sessions: UserSession[];

	@OneToMany(() => Todo, todo => todo.user)
	todos: Todo[];
}