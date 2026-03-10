import { AuthPage } from '@refinedev/antd';

export function Login() {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {
          email: '',
          password: '',
        },
      }}
    />
  );
}
