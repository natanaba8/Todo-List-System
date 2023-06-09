import { addDays } from 'date-fns';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { compareWordSync, hashWord } from '../common/hash';
import { User } from './user.entity';

export enum UserSessionStatus {
	Active = 'Active',
	Expired = 'Expired',
	Revoked = 'Revoked'
}

@Entity()
export class UserSession {
	constructor() {
		this.expires = addDays(new Date(), 3)
	}
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column()
	expires: Date;

	@Column({
		type: 'enum',
		enum: UserSessionStatus,
		default: UserSessionStatus.Active
	})
	status: string;

	public async setToken(token: string): Promise<void> {
		this.token = await hashWord(token)
	}

	public compareTokenSync(token: string): boolean {
		return compareWordSync(token, this.token)
	}

	@ManyToOne(() => User, user => user.sessions)
	user: User;
}