import {fastify} from 'fastify'
import {randomUUID} from 'node:crypto'
import {fastifyCors} from '@fastify/cors'
import {z} from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { channels } from '../broker/channels/index.ts'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'
import { dispatchOrderCreated } from '../broker/messages/order_created.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {origin: '*'})

// Escala horizontal
// Deploy: Blue-green deployment

app.get('/health', () => {
    return 'OK'
})

const createOrderSchema = z.object({
    amount: z.coerce.number(),
}) 

app.post('/orders', {
    schema: createOrderSchema
}, async (request, reply) => {
    const { amount } = request.body as z.infer<typeof createOrderSchema>

    console.log('Creating an order with amount ', amount)

    const orderId = randomUUID()

    dispatchOrderCreated({
        orderId,
        amount,
        customer: {
            id: 'fe6aebbc-2502-4772-a004-d84e42710dfc'
        },
    })

    try {

        await db.insert(schema.orders).values({
        id: randomUUID(),
        customerId: 'fe6aebbc-2502-4772-a004-d84e42710dfc',
        amount,
        })

    }catch(err){
        console.log(err)
    }

    return reply.status(201).send()
})

app.listen({host: '0.0.0.0', port: 3333}).then(() => {
    console.log('[Orders] HTTP Server running!')
})

