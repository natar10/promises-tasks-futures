import React, { useState } from 'react'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import {
  Alert,
  AlertProps,
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'

export const ShortCircuit = () => {
  const [promiseEval, setPromiseEval] = useState<string>('')
  const [promiseAll, setPromiseAll] = useState<AlertProps.Type>()
  const [taskEval, setTaskEval] = useState<string>('')
  const [sequenceTask, setSeqTask] = useState<AlertProps.Type>()

  /**
   * Promise definitions
   */
  const delayPromise =
    (millis: number) =>
      (value: number): Promise<number> =>
        new Promise(resolve =>
          setTimeout(() => {
            setPromiseEval(`Evaluating Promise ${value}`)
            resolve(value)
          }, millis)
        )

  //Add all the promises into an array and run them with Promise.all
  const resultPromise = (): Promise<void> =>
    Promise.all([
      delayPromise(1000)(1),
      delayPromise(2000)(2),
      Promise.reject('short circuit'),
      delayPromise(3000)(3),
      delayPromise(4000)(4),
    ])
      .then(_ => setPromiseAll('success'))
      .catch(e => setPromiseAll('error'))

  /**
   * Task definitions
   */
  const delayTask =
    (millis: number) =>
      (value: number): TE.TaskEither<string, number> =>
        TE.tryCatch(
          () =>
            new Promise(resolve =>
              setTimeout(() => {
                setTaskEval(`Evaluating Task ${value}`)
                resolve(value)
              }, millis)
            ),
          () => 'error'
        )

  const taskArray = [
    delayTask(1000)(1),
    delayTask(1500)(2),
    TE.left<string, number>('short circuit'),
    delayTask(1000)(3),
    delayTask(1500)(4),
  ]

  const result = (): Promise<void> =>
    pipe(
      taskArray,
      A.sequence(TE.taskEitherSeq),
      TE.map(_ => setSeqTask('success')),
      T.map(E.getOrElse(_ => setSeqTask('error')))
    )()

  return (
    <Layout title="Short Circuit" subtitle="Lets see the difference">
      <ColumnLayout columns={2}>
        <Container>
          <h2>Promise</h2>
          <p>All the promises are eagerly evaluated</p>
          <p>
            So they're all invoked when they're created inside the
            array
          </p>
          <Button variant="primary" onClick={resultPromise}>
            Run Promise
          </Button>

          {promiseAll && <Box margin="l">
            <h3>{promiseEval}</h3>
            <Alert type={promiseAll} visible header="Promise all ran">With {promiseAll}</Alert>
          </Box>}

        </Container>
        <Container>
          <h2>fp-ts Task</h2>
          <p>
            As the tasks are lazy we can define them in the array and
            they will not be called inmediately
          </p>
          <p>
            And the short circuit hapens cause we can call the Task in
            sequence
          </p>
          <Button onClick={result}>Run Task</Button>

          <Box margin="l">
            <h3>{taskEval}</h3>
            {sequenceTask && <Alert type={sequenceTask} visible header="Promise all ran">With {sequenceTask}</Alert>}
          </Box>

        </Container>
      </ColumnLayout>
    </Layout>
  )
}
