import React from 'react'
import { Route, Routes } from 'react-router-dom'
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
    name: 'Ref. Transparency',
    path: '/referencial',
    component: <Examples.Referencial />,
  },
  {
    name: 'Composable',
    path: '/composable',
    component: <Examples.Composable />,
  },
  {
    name: 'Short Circuit',
    path: '/short-circuit',
    component: <Examples.ShortCircuit />,
  },
  {
    name: 'Error Handling',
    path: '/error-handling',
    component: <Examples.ErrorHandling />,
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
  {
    name: 'Effect',
    path: '/effect',
    component: <Examples.EffectTs />,
  },
  {
    name: 'RxJs',
    path: '/rxjs',
    component: <Examples.Rxjs />,
  },
]

export const RoutesComponent = (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Examples.Home />}></Route>
    {ROUTES.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={route.component}
      />
    ))}
  </Routes>
)
