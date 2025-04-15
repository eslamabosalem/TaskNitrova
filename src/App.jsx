import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Component/Login';
import SignUp from "./Component/SignUp";
import UsersList from "./Component/UserList";
import UserContextProvider from "./UserContext"; // تأكد من المسار الصحيح

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "login", element: <Login /> },
    { path: "signup", element: <SignUp /> },
    { path: "users", element: <UsersList /> }
  ]);

  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App;
