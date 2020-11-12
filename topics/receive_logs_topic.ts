import amqp = require('amqplib/callback_api');
import { EXCHANGE_NAME, EXCHANGE_TYPE } from './constants'

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

// Connect to RabbitMQ server
amqp.connect('amqp://rabbitmq', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const exchange = EXCHANGE_NAME;
    const exchangeType = EXCHANGE_TYPE;

    // Create a 'fanout' exchange
    channel.assertExchange(exchange, exchangeType, { durable: false })
    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

      args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, (msg) => {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});