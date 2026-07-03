import { customAlphabet as customAlphabetNonSecure } from 'nanoid/non-secure'
import { customAlphabet } from 'nanoid'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const DEFAULT_LENGTH = 12

const randomAlphabetNonSecure = customAlphabetNonSecure(ALPHABET, DEFAULT_LENGTH)

export function generateRandomIdNonSecure(length: number = DEFAULT_LENGTH, prefix?: string) {
	const id = randomAlphabetNonSecure(Math.max(length, 5))
	return prefix ? `${prefix}_${id}` : id
}

const randomAlphabet = customAlphabet(ALPHABET, DEFAULT_LENGTH)

export function generateRandomId(length: number = DEFAULT_LENGTH, prefix?: string) {
	const id = randomAlphabet(Math.max(length, 5))
	return prefix ? `${prefix}_${id}` : id
}