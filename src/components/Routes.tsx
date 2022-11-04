import React from 'react'
import { Route, Navigate, Routes } from 'react-router-dom'
import * as Examples from '../examples'

interface RouteAccess {
  name: string
  path: string
  component: JSX.Element
}

export const ROUTES: RouteAccess[] = [
  {
    name: 'Lazyness',
    path: '/lazy',
    component: <Examples.Lazy />,
  },
  {
    name: 'Referencial Transparency',
    path: '/referencial',
    component: <Examples.Referencial />,
  },
  {
    name: 'Eager Evaluation',
    path: '/eagerness',
    component: <Examples.Eagerness />,
  },
  {
    name: 'Error Handling',
    path: '/error-handling',
    component: <Examples.ErrorHandling />,
  },
  {
    name: 'Composable',
    path: '/composable',
    component: <Examples.Composable />,
  },
  {
    name: 'Remote Data',
    path: '/remote-data',
    component: <Examples.RemoteData />,
  },
  {
    name: 'Fluture',
    path: '/fluture',
    component: <Examples.Fluture />,
  },
]

export const RoutesComponent = (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Examples.Home />}></Route>
    {ROUTES.map(route => (
      <Route key={route.path} path={route.path} element={route.component} />
    ))}
  </Routes>
)
