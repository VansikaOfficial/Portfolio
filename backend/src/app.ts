import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { env } from '@config/env';
import logger from '@config/logger';
import { generalLimiter } from '@middlewares/rateLimiter';
import { notFoundHandler, errorHandler } from '@middlewares/error.middleware';
import routes from '@routes/index';

const app: Application = express();

// ── Security ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to be loaded from another origin (frontend)
  })
);

app.use(
  cors({
    origin: env.CLIENT_URL === '*' ? true : env.CLIENT_URL.split(',').map((o) => o.trim()),
    credentials: true,
  })
);

app.use(generalLimiter);

// ── Core middleware ───────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Logging ───────────────────────────────────────────────
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// ── Static uploads ────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── API routes ────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio CMS API',
    version: '1.0.0',
    docs: `${env.API_PREFIX}/health`,
  });
});

app.use(env.API_PREFIX, routes);

// ── Error handling (must be last) ────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
