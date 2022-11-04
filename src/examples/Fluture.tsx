import React from 'react'
import { useState } from 'react'
import * as T from 'fp-ts/lib/Task'
import { GithubUser } from '../components/types'
import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import { pipe } from 'fp-ts/lib/function'
import { GITHUB_API } from '../utils/constants'

export const Fluture = () => {
  const [promiseUser, setPromiseUser] = useState<GithubUser>()
  const [taskUser, setTaskUser] = useState<GithubUser>()

  //This is a normal promise definition
  const normalPromise = fetch(`${GITHUB_API}/natar10`)
    .then(response => response.json())
    .then(data => setPromiseUser(data))

  //This is a Task definition
  const task: T.Task<GithubUser> = () =>
    fetch(`${GITHUB_API}/stackbuilders`)
      .then(response => response.json())
      .then(data => data)

  const showTaskData = () => pipe(task, T.map(setTaskUser))()

  return (
    <Layout title="Laziness" subtitle="Lets see the difference">
      <ColumnLayout columns={2}>
        <Container>
          <h2>Promise</h2>
          <p>The promise is called as soon as we load</p>
          <Alert
            type="warning"
            visible
            header="The promise is called as soon as we load"
          />
          {promiseUser && (
            <ul>
              <li>{promiseUser.name}</li>
              <li>{promiseUser.created_at}</li>
              <li>{promiseUser.id}</li>
            </ul>
          )}
        </Container>
        <Container>
          <h2>fp-ts Task</h2>
          <p>The task is called only when we decide to do it</p>
          <Button onClick={showTaskData}>Run Task</Button>
          {taskUser && (
            <Box padding={{ top: 'l' }}>
              <Alert
                type="success"
                visible
                header="The task was called only when we decided to call it"
              />
              <ul>
                <li>{taskUser.name}</li>
                <li>{taskUser.created_at}</li>
                <li>{taskUser.id}</li>
              </ul>
            </Box>
          )}
        </Container>
      </ColumnLayout>
    </Layout>
  )
  return <h1>Lazy</h1>
}
