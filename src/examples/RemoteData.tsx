import React, { useState } from 'react'
import * as RD from '@devexperts/remote-data-ts'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { GithubRepo } from '../common/types'
import {
  Alert,
  Box,
  Button,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import { pipe } from 'fp-ts/lib/function'
import { GITHUB_API } from '../utils/constants'

export const RemoteData = () => {
  const [response, setResponse] = useState<
    RD.RemoteData<Error, Array<GithubRepo>>
  >(RD.initial)

  const request = TE.tryCatch<Error, Response>(
    () => fetch(`${GITHUB_API}/natar10/repos`),
    () => new Error('The request failed')
  )

  const runRemoteData = () => {
    if (RD.isInitial(response)) {
      const artificialDelay = TE.fromTask(
        T.delay(300)(T.fromIO(() => setResponse(RD.pending)))
      )
      pipe(
        request,
        TE.apFirstW(artificialDelay),
        TE.chainW(a =>
          TE.tryCatch(
            () => a.json() as Promise<Array<GithubRepo>>,
            _ => new Error('Invalid JSON')
          )
        ),
        TE.match(
          e => setResponse(RD.failure(e as Error)),
          s => setResponse(RD.success(s))
        )
      )()
    }
  }

  return (
    <Layout title="Error Handling" subtitle="Lets see the difference">
      <Container>
        <h2>Task Either Success</h2>
        <Button variant="primary" onClick={runRemoteData}>
          Run Remote Data
        </Button>
        <Box margin={{ top: 'xl' }}>
          {pipe(
            response,
            RD.fold(
              () => <Alert type="info" header="Not called yet" />,
              () => <Alert type="warning" header="Loading..." />,
              e => <Alert type="error" header={e.message} />,
              res => (
                <ul>
                  {res.map(repo => (
                    <li key={repo.id}>{repo.name}</li>
                  ))}
                </ul>
              )
            )
          )}
        </Box>
      </Container>
    </Layout>
  )
}
