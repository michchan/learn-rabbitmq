import amqp = require('amqplib/callback_api');
import { QUEUE_NAME } from './constants'

// Setting up is the same as the publisher; we open a connection and a channel, and declare the queue from which we're going to consume. Note this matches up with the queue that sendToQueue publishes to.
amqp.connect('amqp://rabbitmq', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    // * Same name with the queue in send.ts
    const queue = QUEUE_NAME;

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, msg => {
      console.log(" [x] Received %s", msg.content.toString());
      // Acknowledgement of message processed
      channel.ack(msg);
    }, {
      // automatic acknowledgment mode,
      // see https://www.rabbitmq.com/confirms.html for details
      noAck: true
    });
  });
});