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

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      durable: true
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, msg => {
      const secs = msg.content.toString().split('.').length - 1;
    
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
      }, secs * 1000);
    }, {
      // automatic acknowledgment mode,
      // see https://www.rabbitmq.com/confirms.html for details
      noAck: true
    });
  });
});