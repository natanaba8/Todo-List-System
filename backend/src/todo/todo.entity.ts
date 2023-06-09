import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from '../user/user.entity';
@Entity()
export class Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	text: string;

	@CreateDateColumn()
	timestamp: Date;

	@Column({ default: false })
	done: boolean;

	@ManyToOne(() => User, user => user.todos)
	user: User;
}