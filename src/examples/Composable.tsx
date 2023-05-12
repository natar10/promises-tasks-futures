import React from 'react'
import { useState } from 'react'
import * as T from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import { GithubRepo } from '../common/types'
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

export const Composable = () => {
  const [promiseRepo, setPromiseRepos] = useState<string[]>([])
  const [taskRepos, setTaskRepos] = useState<string[]>([])

  const normalPromise = (): Promise<GithubRepo[]> =>
    fetch(`${GITHUB_API}/natar10/repos`).then(res => res.json())

  // In order to map over the return value, we would need to wrap it in a thunk anyways
  normalPromise().then(data => {
    setPromiseRepos(
      data.filter(r => r.language === 'JavaScript').map(r => r.name)
    )
  })

  //We create the Task
  const task: T.Task<GithubRepo[]> = () =>
    fetch(`${GITHUB_API}/stackbuilders/repos`).then(response =>
      response.json()
    )

  //With out having to extract the data with another thunk we can start maping or manipulating
  //the data acording to what the function needs
  const showTaskData = () =>
    pipe(
      task,
      T.map(
        flow(
          A.filter(r => r.language === 'JavaScript'),
          A.map(r => r.name),
          setTaskRepos
        )
      )
    )()

  return (
    <Layout title="Composable" subtitle="Lets see the difference">
      <ColumnLayout columns={2}>
        <Container>
          <h2>Promise</h2>
          <p>The promise is called as soon as we load</p>
          <Alert
            type="warning"
            visible
            header="The promise is called as soon as we load"
          >
            <p>
              But if we dont extract the data from it there is no way
              to compose the data in advance.
            </p>
            <p>
              In order to map over the return value, we would need to
              wrap it in a thunk anyways
            </p>
          </Alert>
          <ul>
            {promiseRepo.map(repoName => (
              <li key={repoName}>{repoName}</li>
            ))}
          </ul>
        </Container>
        <Container>
          <h2>fp-ts Task</h2>
          <p>The task is called only when we decide to do it</p>
          <Button onClick={showTaskData}>Run Task</Button>
          {taskRepos.length > 0 && (
            <Box padding={{ top: 'l' }}>
              <Alert
                type="success"
                visible
                header="The task was called only when we decided to call it"
              />

              <ul>
                {taskRepos.map(repoName => (
                  <li key={repoName}>{repoName}</li>
                ))}
              </ul>
            </Box>
          )}
        </Container>
      </ColumnLayout>
    </Layout>
  )
  return <h1>Lazy</h1>
}
