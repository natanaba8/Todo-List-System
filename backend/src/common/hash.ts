import 'dotenv/config'
import bcrypt from 'bcrypt'

const rounds = Number(process.env.SALT_ROUNDS || 10)

export async function hashWord(word: string): Promise<string> {
	return bcrypt.hash(word, rounds)
}

export async function compareWord(word: string, hash: string): Promise<boolean> {
	return bcrypt.compare(word, hash)
}

export function compareWordSync(word: string, hash: string): boolean {
	return bcrypt.compareSync(word, hash)
}
