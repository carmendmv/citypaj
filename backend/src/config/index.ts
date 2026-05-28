import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3002'),
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'citypaj',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    },
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'citypaj:',
    ttl: {
      session: parseInt(process.env.REDIS_TTL_SESSION || '86400'), // 24 hours
      cache: parseInt(process.env.REDIS_TTL_CACHE || '3600'), // 1 hour
      rateLimit: parseInt(process.env.REDIS_TTL_RATE_LIMIT || '900'), // 15 minutes
    },
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'citypaj',
    audience: process.env.JWT_AUDIENCE || 'citypaj-users',
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@citypaj.es',
  },
  
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '5242880'), // 5MB
    maxFiles: parseInt(process.env.UPLOAD_MAX_FILES || '6'),
    allowedMimeTypes: (process.env.UPLOAD_ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    s3: {
      bucket: process.env.S3_BUCKET || 'citypaj-uploads',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      endpoint: process.env.S3_ENDPOINT || '',
    },
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  },
  
  rateLimit: {
    general: parseInt(process.env.RATE_LIMIT_GENERAL || '100'),
    auth: parseInt(process.env.RATE_LIMIT_AUTH || '5'),
    upload: parseInt(process.env.RATE_LIMIT_UPLOAD || '10'),
  },
  
  moderation: {
    autoApprove: process.env.MODERATION_AUTO_APPROVE === 'true',
    mlEndpoint: process.env.MODERATION_ML_ENDPOINT || '',
    mlApiKey: process.env.MODERATION_ML_API_KEY || '',
    toxicityThreshold: parseFloat(process.env.MODERATION_TOXICITY_THRESHOLD || '0.7'),
  },
  
  features: {
    emailVerification: process.env.FEATURE_EMAIL_VERIFICATION !== 'false',
    phoneVerification: process.env.FEATURE_PHONE_VERIFICATION === 'true',
    socialLogin: process.env.FEATURE_SOCIAL_LOGIN === 'true',
    notifications: process.env.FEATURE_NOTIFICATIONS !== 'false',
    analytics: process.env.FEATURE_ANALYTICS === 'true',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutTime: parseInt(process.env.LOCKOUT_TIME || '900000'), // 15 minutes
  },
};
