import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { compareWordSync, hashWord } from "../common/hash";

@Entity()
export class ApiKey {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column({ unique: true })
	usedBy: string;

	public async setToken(token: string): Promise<void> {
		this.token = await hashWord(token)
	}

	public compareTokenSync(token: string): boolean {
		return compareWordSync(token, this.token)
	}
}
