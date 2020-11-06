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
    const msg = 'Hello world';

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      durable: true
    });

    // Make our messages as persistent after a RabbitMQ node restart
    channel.sendToQueue(queue, Buffer.from(msg), {
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