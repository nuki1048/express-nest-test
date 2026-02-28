import { adminConfig } from './config';

const authenticate = async (email: string, password: string) => {
  if (
    email === adminConfig.adminEmail &&
    password === adminConfig.adminPassword
  ) {
    return Promise.resolve({ email, password });
  }
  return null;
};

interface AuthConfig {
  auth: {
    authenticate: typeof authenticate;
    cookieName: string;
    cookiePassword: string;
  };
  sessionOptions: {
    resave: boolean;
    saveUninitialized: boolean;
    secret: string;
  };
}

export function getAuthConfig(): AuthConfig | undefined {
  return {
    auth: {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: adminConfig.sessionSecret,
    },
    sessionOptions: {
      resave: true,
      saveUninitialized: true,
      secret: adminConfig.sessionSecret ?? 'change-me-in-production',
    },
  };
}
