import React, { useState, useEffect } from 'react'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { GithubRepo } from '../components/types'
import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import { flow, pipe } from 'fp-ts/lib/function'
import { GITHUB_API } from '../utils/constants'

export const ErrorHandling = () => {
  const [response, setResponse] = useState<
    E.Either<Error, GithubRepo[]>
  >(E.right([]))

  const [promiseResponse, setPromiseResponse] = useState<
    GithubRepo[]
  >([])

  const successRequest = TE.tryCatch<Error, Response>(
    () => fetch(`${GITHUB_API}/natar10/repos`),
    () => new Error('The request failed')
  )

  const failedRequest = TE.tryCatch<Error, Response>(
    () => fetch(`xxxxnatar10/repos`),
    () => new Error('The request failed')
  )

  const runTask = (request: TE.TaskEither<Error, Response>) => {
    pipe(
      request,
      TE.chain(a =>
        TE.tryCatch<Error, GithubRepo[]>(
          () => a.json() as Promise<GithubRepo[]>,
          () => new Error('Failed to parse JSON payload')
        )
      ),
      TE.match(flow(E.left, setResponse), flow(E.right, setResponse))
    )()
  }

  /**
   * Promise definitions
   */

  const successPromise = () => {
    fetch(`${GITHUB_API}/natar10/repos`)
      .then(r => r.json())
      .then(res => setPromiseResponse(res))
  }

  const failedPromise = () => {
    fetch(`natar10/repos`)
      .then(r => r.json())
      .then(res => setPromiseResponse(res))
      .catch(e => console.log(e))
  }

  return (
    <Layout title="Error Handling" subtitle="Lets see the difference">
      <Box margin={{ bottom: 'xxl' }}>
        <h2>Tasks</h2>
        <ColumnLayout columns={2}>
          <Container>
            <h2>Task Either Success</h2>
            <Button
              variant="primary"
              onClick={() => runTask(successRequest)}
            >
              Run Successful Task
            </Button>
          </Container>
          <Container>
            <h2>Task Either Failure</h2>
            <Button
              variant="normal"
              onClick={() => runTask(failedRequest)}
            >
              Run Failure Task
            </Button>
          </Container>
        </ColumnLayout>
        <Box margin={{ top: 'xl' }}>
          <Container>
            <ul>
              {pipe(
                response,
                E.fold(
                  e => (
                    <Alert
                      type="warning"
                      visible
                      header="There was an error"
                    >
                      {e.message}
                    </Alert>
                  ),
                  r => (
                    <>
                      {r.map(repo => (
                        <li key={repo.id}>{repo.name}</li>
                      ))}
                    </>
                  )
                )
              )}
            </ul>
          </Container>
        </Box>
      </Box>

      <Box margin={{ bottom: 'xxl' }}>
        <h2>Promises</h2>
        <ColumnLayout columns={2}>
          <Container>
            <h2>Promise Success</h2>
            <Button variant="primary" onClick={successPromise}>
              Run Successful Promise
            </Button>
          </Container>
          <Container>
            <h2>Promise Failure</h2>
            <Button variant="normal" onClick={failedPromise}>
              Run Failure Promise
            </Button>
          </Container>
        </ColumnLayout>
        <Box margin={{ top: 'xl' }}>
          <Container>
            <ul>
              {promiseResponse.map(repo => (
                <li key={repo.id}>{repo.name}</li>
              ))}
            </ul>
          </Container>
        </Box>
      </Box>
    </Layout>
  )
  return <h1>Lazy</h1>
}
