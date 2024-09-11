// src/routes/userRoutes.ts
import { RouteObject } from 'react-router-dom';
import UserPage from '../../pages/UserPage';
import UserDetailPage from '../../pages/UserDetailPage';
import UserAddPage from '../../pages/UserAddPage';
import UserUpdatePage from '../../pages/UserUpdatePage';
// import DetailUserPage from '../../pages/DetailUserPage';

export const userRoute: RouteObject[] = [
  { path: "/user", element: <UserPage /> },
  { path: "/users/:userId", element: <UserDetailPage /> },  
  { path: "/user/add", element: <UserAddPage /> },  
  { path: "/user/:userId/edit", element: <UserUpdatePage /> },
];