import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const invoices = pgTable('orders', {
    id: text().primaryKey(),
    orderId: text().notNull(),
    createdAt: timestamp().defaultNow().notNull()
}) 