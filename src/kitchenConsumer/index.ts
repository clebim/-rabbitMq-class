import amqp from 'amqplib';
import { appConfig } from '../config/app';

const { amqpExchange, amqpHostName, amqpPort, amqpKitchenQueue } = appConfig;

const connectOptions: amqp.Options.Connect = {
  port: amqpPort,
  hostname: amqpHostName,
};

const queueOptions = {
  durable: true,
};

const consumeOptions = {
  noAck: false,
};

const processMessage = async (connection: amqp.Connection) => {

  const channelConsumer = await connection.createChannel();
  await channelConsumer.assertQueue(
    amqpKitchenQueue,
    queueOptions,
  );
  await channelConsumer.bindQueue(amqpKitchenQueue, amqpExchange, 'kitchen');
  await channelConsumer.consume(
    amqpKitchenQueue,
    (message) => {
      const parsedMessage = JSON.parse(message.content.toString());
      console.log('subscribed', parsedMessage);
      channelConsumer.ack(message, parsedMessage);
    },
    consumeOptions,
  );
}

const createConnection = async () => {
  try {
    const connection = await amqp.connect(connectOptions);
    await processMessage(connection);
  } catch (error) {
    console.log(error);
  }
}

createConnection();