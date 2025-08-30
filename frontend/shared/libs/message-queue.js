const amqp = require('amqplib/callback_api');

class MessageQueue {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    
    return new Promise((resolve, reject) => {
      amqp.connect(rabbitmqUrl, (error0, connection) => {
        if (error0) {
          console.error('❌ RabbitMQ Connection Error:', error0);
          return reject(error0);
        }

        this.connection = connection;
        
        connection.createChannel((error1, channel) => {
          if (error1) {
            console.error('❌ RabbitMQ Channel Error:', error1);
            return reject(error1);
          }

          this.channel = channel;
          this.isConnected = true;
          
          console.log('✅ RabbitMQ Connected');
          resolve();
        });

        connection.on('error', (err) => {
          console.error('RabbitMQ Connection Error:', err);
          this.isConnected = false;
        });

        connection.on('close', () => {
          console.log('RabbitMQ Connection Closed');
          this.isConnected = false;
        });
      });
    });
  }

  async publish(queue, message) {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.channel.assertQueue(queue, {
        durable: true
      });

      const sent = this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true
      });

      if (sent) {
        console.log(`📤 Message sent to queue ${queue}:`, message);
        resolve(true);
      } else {
        console.error(`❌ Failed to send message to queue ${queue}`);
        reject(new Error('Failed to send message'));
      }
    });
  }

  async consume(queue, callback) {
    if (!this.isConnected) {
      await this.connect();
    }

    this.channel.assertQueue(queue, {
      durable: true
    });

    this.channel.prefetch(1); // Procesar un mensaje a la vez

    console.log(`👂 Waiting for messages in queue ${queue}`);

    this.channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`📥 Received message from queue ${queue}:`, content);
          
          await callback(content);
          
          this.channel.ack(msg);
          console.log(`✅ Message acknowledged from queue ${queue}`);
        } catch (error) {
          console.error(`❌ Error processing message from queue ${queue}:`, error);
          this.channel.nack(msg, false, true); // Requeue message
        }
      }
    }, {
      noAck: false
    });
  }

  // Colas específicas para diferentes tipos de mensajes
  async publishUserActivity(activity) {
    return await this.publish('user_activities', activity);
  }

  async publishNotification(notification) {
    return await this.publish('notifications', notification);
  }

  async publishAssessmentResult(result) {
    return await this.publish('assessment_results', result);
  }

  async publishAnalyticsEvent(event) {
    return await this.publish('analytics_events', event);
  }
}

module.exports = new MessageQueue();