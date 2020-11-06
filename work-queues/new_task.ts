import amqp = require('amqplib/callback_api');
import { QUEUE_NAME } from './constants'

// Connect to RabbitMQ server
amqp.connect('amqp://rabbitmq', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  // Create a channel, which is where most of the API for getting things done resides:
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    // To send, we must declare a queue for us to send to; then we can publish a message to the queue:
    const queue = QUEUE_NAME;
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertQueue(queue, {
      // Make sure that the queue will survive when a RabbitMQ node restart
      durable: true
    });
    // "default" exchange
    channel.sendToQueue(queue, Buffer.from(msg), {
      // Make our messages as persistent after a RabbitMQ node restart
      // But it doesn't guarantee the messages will always be kept.
      // There is still a short window of down time.
      // Stronger guarantee: https://www.rabbitmq.com/confirms.html
      persistent: true
    });
    console.log(" [x] Sent %s", msg);
  });

  /**
   * Declaring a queue is idempotent - it will only be created if it doesn't exist already. 
   * The message content is a byte array, so you can encode whatever you like there.
   * Lastly, we close the connection and exit:
   */
  setTimeout(() => { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});