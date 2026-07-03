import type { RequestEvent } from '@sveltejs/kit'
import type { UserRole } from './db/schema'
import { dev } from '$app/env'

export type AuthUser = {
	userId: string
	firstName: string
	lastName: string
	role: UserRole
}

const SESSION_KEY = 'session'

const SESSION_COOKIE_OPTIONS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 30, // 30 days
	secure: !dev,
	sameSite: 'lax' as const,
} as const

const getSessionCookie = (event: RequestEvent) => {
	return event.cookies.get(SESSION_KEY)
}

const setSessionCookie = (event: RequestEvent, session: string) => {
	event.cookies.set(SESSION_KEY, session, SESSION_COOKIE_OPTIONS)
}

export const getUser = async (event: RequestEvent) => {
	if (event.locals.user) return event.locals.user

	const session = getSessionCookie(event)
	if (!session) return null

	const { userId } = JSON.parse(session) as { userId: string }

	return { userId }
}
