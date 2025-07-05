import amqp from 'amqplib'

if(!process.env.BROKER_URL){
    throw new Error('BROKER_URL must be configured.')
}

// ECMA Script modules. Top level await "type": "module"
export const broker = await amqp.connect(process.env.BROKER_URL)

