const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('✅ Redis Client Connected');
    });

    // Promisificar métodos
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, expireSeconds = 3600) {
    try {
      const stringValue = JSON.stringify(value);
      await this.setAsync(key, stringValue);
      if (expireSeconds) {
        await this.expireAsync(key, expireSeconds);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async getCourses(userId) {
    return await this.get(`courses:${userId}`);
  }

  async setCourses(userId, courses, expireSeconds = 3600) {
    return await this.set(`courses:${userId}`, courses, expireSeconds);
  }

  async invalidateUserCache(userId) {
    const keys = [`courses:${userId}`, `profile:${userId}`, `progress:${userId}`];
    for (const key of keys) {
      await this.del(key);
    }
  }
}

module.exports = new RedisClient();