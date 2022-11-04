import React from 'react'
import { Layout } from '../components/Layout'
import Cards from '@cloudscape-design/components/cards'
import { ROUTES } from '../components/Routes'
import { Button } from '@cloudscape-design/components'
import { Link } from 'react-router-dom'

export const Home = () => (
  <Layout title="Examples" subtitle="Check out all the examples">
    <Cards
      cardDefinition={{
        header: e => e.name,
        sections: [
          {
            id: 'name',
            content: e => (
              <Link to={e.path}>
                <Button>Lets Go</Button>
              </Link>
            ),
          },
        ],
      }}
      cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
      items={ROUTES}
      visibleSections={['name']}
    />
  </Layout>
)
