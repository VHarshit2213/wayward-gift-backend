import 'dotenv/config';

const required = (name, value) => {
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
};

 const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,
  DB_URL: required('DB_URL', process.env.DB_URL),
  JWT_SECRET: required('JWT_SECRET', process.env.JWT_SECRET),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || '10',
  SMTP_USER: required('SMTP_USER', process.env.SMTP_USER),
  SMTP_PASS: required('SMTP_PASS', process.env.SMTP_PASS),
  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
  STRIPE_SECRET_KEY: required('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
};


export default env;