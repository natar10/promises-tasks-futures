import * as React from 'react'
import TopNavigation from '@cloudscape-design/components/top-navigation'

export const NavBar = () => {
  return (
    <TopNavigation
      id="header"
      identity={{
        href: '#',
        title: 'Are promises our only choice?',
      }}
      utilities={[
        {
          type: 'button',
          text: 'Link',
          href: 'https://example.com/',
          externalIconAriaLabel: ' (opens in a new tab)',
        },
      ]}
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
