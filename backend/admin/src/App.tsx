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
  HolidayRentalList,
  HolidayRentalCreate,
  HolidayRentalEdit,
} from './pages/holiday-rentals';
import {
  YourFutureHomeList,
  YourFutureHomeCreate,
  YourFutureHomeEdit,
} from './pages/your-future-home';
import { BlogPostList, BlogPostCreate, BlogPostEdit } from './pages/blog-posts';
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
              name: 'holiday-rentals',
              list: '/holiday-rentals',
              create: '/holiday-rentals/create',
              edit: '/holiday-rentals/edit/:id',
              meta: { label: 'Holiday Rentals' },
            },
            {
              name: 'your-future-home',
              list: '/your-future-home',
              create: '/your-future-home/create',
              edit: '/your-future-home/edit/:id',
              meta: { label: 'Your Future Home' },
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
              <Route
                index
                element={<Navigate to="/holiday-rentals" replace />}
              />
              <Route path="holiday-rentals">
                <Route index element={<HolidayRentalList />} />
                <Route path="create" element={<HolidayRentalCreate />} />
                <Route path="edit/:id" element={<HolidayRentalEdit />} />
              </Route>
              <Route path="your-future-home">
                <Route index element={<YourFutureHomeList />} />
                <Route path="create" element={<YourFutureHomeCreate />} />
                <Route path="edit/:id" element={<YourFutureHomeEdit />} />
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
