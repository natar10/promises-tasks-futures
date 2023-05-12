import React from 'react'
import { useState } from 'react'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'

export const ShortCircuit = () => {
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
                console.log(`evaluating ${value}`)
                resolve(value)
              }, millis)
            ),
          () => 'error'
        )

  const taskArray = [
    delayTask(1000)(1),
    delayTask(2000)(2),
    TE.left<string, number>('short circuit'),
    delayTask(3000)(3),
    delayTask(4000)(4),
  ]

  const result = (): Promise<void> =>
    pipe(
      taskArray,
      A.sequence(TE.taskEitherSeq),
      TE.map(console.log),
      T.map(E.getOrElse(console.error))
    )()

  /**
   * Promise definitions
   */
  const delayPromise =
    (millis: number) =>
      (value: number): Promise<number> =>
        new Promise(resolve =>
          setTimeout(() => {
            console.log(`evaluating ${value}`)
            resolve(value)
          }, millis)
        )

  const resultPromise = (): Promise<void> =>
    Promise.all([
      delayPromise(1000)(1),
      delayPromise(2000)(2),
      Promise.reject('short circuit'),
      delayPromise(3000)(3),
      delayPromise(4000)(4),
    ])
      .then(console.log)
      .catch(console.error)

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
        </Container>
      </ColumnLayout>
    </Layout>
  )
}
