import React, { useEffect } from 'react'
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

  useEffect(() => {
    // In order to map over the return value,
    // we would need to wrap it in a thunk anyways
    fetch(`${GITHUB_API}/natar10/repos`)
      .then(res => res.json())
      .then((data: GithubRepo[]) => {
        setPromiseRepos(
          data
            .filter(r => ['JavaScript', 'C++'].includes(r.language))
            .map(r => r.name)
        )
      })
  }, [])

  //We create the Task
  const task: T.Task<GithubRepo[]> = () =>
    fetch(`${GITHUB_API}/stackbuilders/repos`).then(response =>
      response.json()
    )

  //With out having to extract the data with another thunk we can start maping or manipulating
  //the data according to what the function needs
  const getRepoNames = (): T.Task<string[]> =>
    pipe(
      task,
      T.delay(1000),
      T.map(
        flow(
          A.filter(r => ['JavaScript', 'C++'].includes(r.language)),
          A.map(r => r.name)
        )
      )
    )

  const showTaskData = () =>
    pipe(getRepoNames(), T.map(setPromiseRepos))()

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
}
