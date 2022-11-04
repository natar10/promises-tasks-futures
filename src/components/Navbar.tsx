import * as React from 'react'
import TopNavigation, {
  TopNavigationProps,
} from '@cloudscape-design/components/top-navigation'
import { ROUTES } from '../components/Routes'
import { useNavigate } from 'react-router-dom'

export const NavBar = () => {
  const navigate = useNavigate()
  const links: TopNavigationProps.Utility[] = ROUTES.map(route => ({
    type: 'button',
    text: route.name,
    external: false,
    onClick: () => navigate(route.path),
  }))
  return (
    <TopNavigation
      id="header"
      identity={{
        href: '#',
        title: 'Are promises our only choice?',
      }}
      utilities={links}
      i18nStrings={{
        searchIconAriaLabel: 'Search',
        searchDismissIconAriaLabel: 'Close search',
        overflowMenuTriggerText: 'More',
        overflowMenuTitleText: 'All',
        overflowMenuBackIconAriaLabel: 'Back',
        overflowMenuDismissIconAriaLabel: 'Close menu',
      }}
    />
  )
}
