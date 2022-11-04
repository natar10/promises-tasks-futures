import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { NavBar } from './components/Navbar'
import { RoutesComponent } from './components/Routes'
import '@cloudscape-design/global-styles/index.css'

export const App = (): JSX.Element => (
  <BrowserRouter>
    <NavBar />
    <RoutesComponent />
  </BrowserRouter>
)
