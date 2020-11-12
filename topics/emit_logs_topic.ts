import amqp = require('amqplib/callback_api');
import { EXCHANGE_NAME, EXCHANGE_TYPE, SEVERITY_INFO } from './constants';

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
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World!';
    const key = (args.length > 0) ? args[0] : `anonymous.${SEVERITY_INFO}`;

    // Asset an exchange, as publishing to a non-existing exchange is forbidden.
    channel.assertExchange(exchange, exchangeType, {
      durable: false
    });
    // The empty string as second parameter means that
    // we don't want to send the message to any specific queue.
    // We want only to publish it to our 'logs' exchange.
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0); 
  }, 500);
});