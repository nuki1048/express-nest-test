const isProduction = process.env.NODE_ENV === 'production';

const sessionSecret = process.env.ADMIN_SESSION_SECRET;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (isProduction && !sessionSecret) {
  throw new Error(
    'ADMIN_SESSION_SECRET must be set in production (NODE_ENV=production)',
  );
}

if (!adminEmail || !adminPassword) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
}

export const adminConfig = {
  sessionSecret: sessionSecret ?? 'change-me-in-production',
  adminEmail,
  adminPassword,
  branding: {
    companyName: 'Largo Estate',
    withMadeWithLove: false,
    logo: false,
  },
} as const;
