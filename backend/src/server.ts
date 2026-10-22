import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { env } from '@config/env';
import logger from '@config/logger';
import { AppDataSource } from '@config/data-source';
import app from './app';

// Ensure the logs directory exists before winston's File transports write to it
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('✅ Database connection established');

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Portfolio CMS API running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`   → http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await AppDataSource.destroy();
        logger.info('Database connection closed. Bye!');
        process.exit(0);
      });

      // Force shutdown if it hangs
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error(`Unhandled Rejection: ${reason}`);
    });

    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    logger.error(`❌ Failed to start server: ${(err as Error).message}`);
    process.exit(1);
  }
};

startServer();
