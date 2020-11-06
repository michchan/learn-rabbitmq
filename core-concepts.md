# Core Concepts of RabbitMQ

## Roles

- A producer is a user application that sends messages.
- A queue is a buffer that stores messages.
- A consumer is a user application that receives messages.

## Messaging model

The core idea in the messaging model in RabbitMQ is that the producer **never sends any messages directly to a queue**.

Instead, **the producer can only send messages to an exchange.** An exchange is a very simple thing. On one side it receives messages from producers and the other side it pushes them to queues.

## AMQP model

![AMQP Model](https://www.rabbitmq.com/img/tutorials/intro/hello-world-example-routing.png)

## Exchange types

**Exchange = message router (to queue)**

- `direct` : 
  - ideal for **unicast** routing of messages
  - distribute tasks between multiple workers (instances of the same application) in a round robin manner.
- `fanout` :
  - ideal for **broadcast** routing of messages.
  - routes messages to all of the queues that are bound to it
- `topic`: 
  - ideal for **multicast** routing of messages
  - Whenever a problem **involves multiple consumers/applications that selectively choose which type of messages they want to receive**
- `headers`:
  - Ignore routing key and use header attributes for binding

More: https://www.rabbitmq.com/tutorials/amqp-concepts.html
