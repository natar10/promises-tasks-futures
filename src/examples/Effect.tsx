import React, { useState } from 'react'
import {
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'

export const Effect = () => {


  return (
    <Layout
      title="Effect"
      subtitle="I don't want that future anymore"
    >
      <ColumnLayout columns={2}>
        <Container>
          <h2>Effect</h2>
          <p>The future is also lazy</p>
          <p>Has most of the benefits of a TaskEither</p>
          <p>But it can also be Cancelable</p>
          <p>Promises are not Cancelable</p>
          <h3>Result of the Future:</h3>
          {/* <h1 style={{ fontSize: '80px' }}>{answer}</h1> */}
        </Container>
        {/* <Container>
          <h2>Run the task here</h2>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => setCancel(runFuture)}
            >
              Run Future
            </Button>
          </Box>
          <Box>
            <Button
              disabled={cancel === undefined}
              iconName="close"
              onClick={cancelFuture}
            >
              Cancel Future
            </Button>
          </Box>
        </Container> */}
      </ColumnLayout>
    </Layout>
  )
}
