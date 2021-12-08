import amqp from 'amqplib';
import { appConfig } from '../config/app';

const { amqpExchange, amqpHostName, amqpPort, amqpBarQueue } = appConfig;

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
    amqpBarQueue,
    queueOptions,
  );
  await channelConsumer.bindQueue(amqpBarQueue, amqpExchange, 'bar');
  await channelConsumer.consume(
    amqpBarQueue,
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