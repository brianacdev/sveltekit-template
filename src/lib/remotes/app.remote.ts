import { query, form, getRequestEvent } from '$app/server'
import { z } from 'zod'
import { db, t, f } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { getUser } from '$lib/server/auth'

export const getPhotos = query(async () => {
	const photos = await db.select().from(t.photos).where(f.eq(t.photos.isDeleted, false))

	return photos
})

export const getTime = query.live(async function* () {
	while (true) {
		yield new Date()
		await new Promise((f) => setTimeout(f, 1000))
	}
})

export const createPost = form(
	z.object({
		title: z.string().nonempty(),
		content: z.string().nonempty(),
	}),
	async ({ title, content }) => {
		// Check the user is logged in
		const event = getRequestEvent()
		const user = await getUser(event)
		if (!user) error(401, 'Unauthorized')

		const slug = title.toLowerCase().replace(/ /g, '-')

		// Insert into the database
		await db.sql`
			INSERT INTO post (slug, title, content)
			VALUES (${slug}, ${title}, ${content})
		`

		// Redirect to the newly created page
		redirect(303, `/blog/${slug}`)
	},
)
