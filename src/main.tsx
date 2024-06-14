import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "antd-mobile/es/global";
import suspense from "~/advance/suspense";
import { LazyHome, LazyResult, LazyScale } from "~/pages";
import "~/index.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: suspense(<LazyHome />),
  },
  {
    path: "/scale",
    children: [
      {
        path: ":path",
        element: suspense(<LazyScale />),
      },
    ],
  },
  {
    path: "/result",
    children: [
      {
        path: ":path",
        element: suspense(<LazyResult />),
      },
    ],
  },
]);

window.matchMedia("(prefers-color-scheme: dark)").matches &&
  document.documentElement.setAttribute("data-prefers-color-scheme", "dark");

// biome-ignore lint/style/noNonNullAssertion: root can not be null
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
