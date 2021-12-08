import amqp from "amqplib";
import { appConfig } from "../config/app";

type IPublisherMessageToExchangeProps = {
  routingKey: 'kitchen' | 'bar';
  message: {
    item: string;
  };
}

const exchangeOptions: amqp.Options.AssertExchange = {
  durable: true,
}

export const publisherMessageToExchange = async ({ routingKey, message }: IPublisherMessageToExchangeProps) => {
 
  try {
    const { amqpExchange, amqpHostName, amqpPort } = appConfig;

    const connectOptions: amqp.Options.Connect = {
      port: amqpPort,
      hostname: amqpHostName,
    };
  
    const connection = await amqp.connect(connectOptions);
    const channel = await connection.createChannel();
  
    await channel.assertExchange(amqpExchange, 'direct', exchangeOptions);
    const buffer = Buffer.from(JSON.stringify(message));
    channel.publish(amqpExchange, routingKey, buffer);
  
    await channel.close();
    await connection.close();
  } catch (error) {
    console.log('error in publish message to exchange', error)
    throw new Error(error);
  }

}