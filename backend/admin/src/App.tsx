import { Refine, Authenticated } from '@refinedev/core';
import routerProvider from '@refinedev/react-router-v6';
import { RefineThemes, ThemedLayoutV2 } from '@refinedev/antd';
import { ConfigProvider } from 'antd';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { Login } from './pages/Login';
import {
  ApartmentList,
  ApartmentCreate,
  ApartmentEdit,
} from './pages/apartments';
import {
  BlogPostList,
  BlogPostCreate,
  BlogPostEdit,
} from './pages/blog-posts';
import { ContactList, ContactCreate, ContactEdit } from './pages/contacts';
import {
  ContactFormSubmissionList,
  ContactFormSubmissionShow,
} from './pages/contact-form-submissions';

function App() {
  return (
    <ConfigProvider theme={RefineThemes.Blue}>
      <BrowserRouter basename="/admin">
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          resources={[
            {
              name: 'apartments',
              list: '/apartments',
              create: '/apartments/create',
              edit: '/apartments/edit/:id',
            },
            {
              name: 'blog-posts',
              list: '/blog-posts',
              create: '/blog-posts/create',
              edit: '/blog-posts/edit/:id',
            },
            {
              name: 'contacts',
              list: '/contacts',
              create: '/contacts/create',
              edit: '/contacts/edit/:id',
            },
            {
              name: 'contact-form-submissions',
              list: '/contact-form-submissions',
              show: '/contact-form-submissions/show/:id',
            },
          ]}
          options={{ syncWithLocation: true }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <Authenticated
                  key="authenticated"
                  fallback={<Navigate to="/login" replace />}
                >
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route index element={<Navigate to="/apartments" replace />} />
              <Route path="apartments">
                <Route index element={<ApartmentList />} />
                <Route path="create" element={<ApartmentCreate />} />
                <Route path="edit/:id" element={<ApartmentEdit />} />
              </Route>
              <Route path="blog-posts">
                <Route index element={<BlogPostList />} />
                <Route path="create" element={<BlogPostCreate />} />
                <Route path="edit/:id" element={<BlogPostEdit />} />
              </Route>
              <Route path="contacts">
                <Route index element={<ContactList />} />
                <Route path="create" element={<ContactCreate />} />
                <Route path="edit/:id" element={<ContactEdit />} />
              </Route>
              <Route path="contact-form-submissions">
                <Route index element={<ContactFormSubmissionList />} />
                <Route
                  path="show/:id"
                  element={<ContactFormSubmissionShow />}
                />
              </Route>
            </Route>
          </Routes>
        </Refine>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
