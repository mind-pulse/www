import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'antd-mobile/es/global'
import { LazyHome, LazyResult, LazyScale } from '~/pages'
import suspense from '~/advance/suspense'
import '~/index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: suspense(<LazyHome />),
  },
  {
    path: '/scale',
    children: [
      {
        path: ':path',
        element: suspense(<LazyScale />),
      },
    ],
  },
  {
    path: '/result',
    children: [
      {
        path: ':path',
        element: suspense(<LazyResult />),
      },
    ],
  },
])

window.matchMedia('(prefers-color-scheme: dark)').matches &&
  document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
