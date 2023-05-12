import React from 'react'
import * as T from 'fp-ts/lib/Task'
import {
  Alert,
  Box,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'

export const Referencial = () => {
  let iniPromise: string[] = []
  let promise: string[] = []
  let task: string[] = []

  const twoPrintsInitial: [Promise<void>, Promise<void>] = [
    new Promise(res => {
      iniPromise = [...iniPromise, `Runned ${iniPromise.length + 1}`]
      res()
    }),
    new Promise(res => {
      iniPromise = [...iniPromise, `Runned ${iniPromise.length + 1}`]
      res()
    }),
  ]

  // Refactored Promise has cached the result of print (which was void),
  // and will therefore not run it again.
  const printPromise: Promise<void> = new Promise(res => {
    promise = [...promise, `Runned ${promise.length + 1}`]
    res()
  })
  const twoPrints: [Promise<void>, Promise<void>] = [
    printPromise,
    printPromise,
  ]

  //This is a Task definition
  const printTask: T.Task<void> = () =>
    new Promise(res => {
      task = [...task, `Runned ${task.length + 1}`]
    })
  const twoPrintsRefactored: [T.Task<void>, T.Task<void>] = [
    printTask,
    printTask,
  ]
  twoPrintsRefactored.map(invoke => invoke())

  return (
    <Layout
      title="Referencial Transparency"
      subtitle="Lets see the difference"
    >
      <Box margin={{ bottom: 'xl' }}>
        <Container>
          <h2> InitialPromise</h2>
          <p>The data estructure containing two promises</p>
          <h3>Result:</h3>
          <ul>
            {iniPromise.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Container>
      </Box>
      <ColumnLayout columns={2}>
        <Container>
          <h2>Refactored Promise</h2>
          <Alert
            type="warning"
            visible
            header="The promise runs only once"
          >
            <p>
              Promise has cached the result of print (which was void),
            </p>
            <p>and will therefore not run it again.</p>
          </Alert>
          <h3>Result:</h3>
          <ul>
            {promise.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Container>
        <Container>
          <h2>fp-ts Task</h2>
          <p>The task is called only when we decide to do it</p>
          {task && (
            <Box padding={{ top: 'l' }}>
              <Alert
                type="success"
                visible
                header="Referencial transparency"
              >
                <p>
                  If code is referentially transparent, we can always
                  refactor duplicate code without changing the
                  expected behavior.
                </p>
                <p>
                  Referential transparency means that any expression
                  can be replaced by its value without changing the
                  behavior of the program. Things are what they look
                  like - our intentions are 'transparent'.
                </p>
              </Alert>
              <h3>Result:</h3>
              {task.map(t => (
                <li key={t}>{t}</li>
              ))}
            </Box>
          )}
        </Container>
      </ColumnLayout>
    </Layout>
  )
}
