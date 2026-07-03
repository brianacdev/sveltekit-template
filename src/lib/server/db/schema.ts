import {
	pgTable,
	text,
	type AnyPgColumn,
	timestamp,
	boolean,
	serial,
	uniqueIndex,
	integer,
} from 'drizzle-orm/pg-core'
import { generateRandomId } from '$lib/utils/string.util'
import { sql } from 'drizzle-orm'

export const USER_ROLES = ['admin', 'user'] as const
export type UserRole = (typeof USER_ROLES)[number]
export const USER_ROLE_DEFAULT: UserRole = 'user'

export const users = pgTable('users', {
	userId: text('user_id')
		.primaryKey()
		.$defaultFn(() => generateRandomId(16, 'u')),

	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),

	photoId: text('photo_id'),
	role: text('role').notNull().$type<UserRole>().default(USER_ROLE_DEFAULT),
	bannedAt: timestamp('banned_at'),
	bannedBy: text('banned_by').references((): AnyPgColumn => users.userId),
	bannedReason: text('banned_reason'),
	isBanned: boolean('is_banned')
		.generatedAlwaysAs(sql`(banned_at IS NOT NULL AND banned_by IS NOT NULL)`)
		.notNull(),
	lastLoginAt: timestamp('last_login_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
})

export const photos = pgTable('photos', {
	photoId: text('photo_id')
		.primaryKey()
		.$defaultFn(() => generateRandomId(16, 'p')),

	photoUrl: text('photo_url').notNull(),
	deletedAt: timestamp('deleted_at'),
	deletedBy: text('deleted_by').references(() => users.userId),
	isDeleted: boolean('is_deleted')
		.generatedAlwaysAs(sql`(deleted_at IS NOT NULL AND deleted_by IS NOT NULL)`)
		.notNull(),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.userId),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const posts = pgTable(
	'posts',
	{
		postId: serial('post_id').primaryKey(),

		title: text('title').notNull(),
		slug: text('slug').notNull(),
		content: text('content').notNull(),
		deletedAt: timestamp('deleted_at'),
		deletedBy: text('deleted_by').references(() => users.userId),
		isDeleted: boolean('is_deleted')
			.generatedAlwaysAs(sql`(deleted_at IS NOT NULL AND deleted_by IS NOT NULL)`)
			.notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [uniqueIndex('ixu__posts_slug').on(t.slug)],
)

export const postComments = pgTable('post_comments', {
	commentId: serial('comment_id').primaryKey(),

	postId: integer('post_id')
		.notNull()
		.references(() => posts.postId),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
