import React, { useState } from 'react'
import * as Effect from '@effect/io/Effect'
import { flow, pipe } from '@effect/data/Function'
import * as RA from '@effect/data/ReadonlyArray'
import * as Schedule from '@effect/io/Schedule'
import * as Duration from '@effect/data/Duration'
import * as Option from '@effect/data/Option'

import {
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import { GITHUB_API } from '../utils/constants'
import {
  BadJson,
  BadRequest,
  InvalidGithubUser,
  isUser,
  OnlyUserAllowed,
  parseGithubUser,
} from '../common/decode'
import { GithubUser } from '../common/types'
import { mockUserNames } from '../mocks/ghMocks'

export const EffectTs = () => {
  const [answer, setAnswer] = useState<string>('')

  //Here we create that Effect, fetch the API,
  //get the JSON and parse/validate the JSON data
  const fetchUser = (
    user: string
  ): Effect.Effect<
    never,
    BadRequest | BadJson | InvalidGithubUser,
    GithubUser
  > =>
    pipe(
      Effect.tryCatchPromise(
        () => fetch(`${GITHUB_API}/${user}`),
        e => new BadRequest(e)
      ),
      Effect.flatMap(res =>
        Effect.tryCatchPromise(
          () => res.json() as Promise<unknown>,
          e => new BadJson(e)
        )
      ),
      Effect.flatMap(parseGithubUser)
    )

  //Recover from one of those failures, we can use catchTag
  const catchInvalidUser = pipe(
    fetchUser('natar10'),
    Effect.catchTag('InvalidGithubUser', e =>
      Effect.succeed([`recover from ${e._tag}`, e.value] as const)
    )
  )

  //Catch InvalidGithubUser but return another error called OnlyUserAllowed
  const catchInvalidReturnError = pipe(
    fetchUser('natar10'),
    Effect.catchTag('InvalidGithubUser', e =>
      Effect.fail(new OnlyUserAllowed(e.value))
    )
  )

  //Recover from all the errors all at once
  //Retry with a scheduler
  const catchAll = pipe(
    fetchUser('natar10'),
    Effect.retry(Schedule.dayOfWeek(7)),
    Effect.catchAll(e => Effect.succeed(['recover', e._tag] as const))
  )

  //Fallback
  const fallback = pipe(
    fetchUser('natar10'),
    Effect.orElse(() =>
      Effect.succeed('If something fails just show this string')
    )
  )

  /* Concurrency */

  const effects = ['natar10', 'stackbuilders', 'Effect-TS'].map(
    fetchUser
  )

  //Generators solving the callback hell
  const getUserNames = Effect.gen(function* ($) {
    // Here we can resolve the async operations in parallel
    // and we get an array of the final value
    const users = yield* $(Effect.allPar(effects))
    setAnswer(users.reduce((acc, a) => `${a.name} - ${acc}`, ''))

    // Here instead we can only collect the operations that actually return something
    // We turn it into an optional and collectAllPar collects only the
    // elements where effect return a some
    const effects2 = effects.map(flow(Effect.map(Option.some)))
    const cids = yield* $(Effect.collectAllPar(effects2))
    console.log('cids', cids)
  })

  const sumAllPublicRepos = Effect.gen(function* ($) {
    // There are many operators that work in parallel.
    // We can model the Effect and then reduce it to a single
    // effect working in parallel
    const publicRepos = pipe(
      effects,
      RA.map(effect => Effect.map(effect, user => user.public_repos)),
      RA.map(effect =>
        Effect.catchAll(effect, _ => Effect.succeed(0))
      ),
      Effect.reduceAllPar(Effect.succeed(0), (acc, a) => acc + a)
    )
    setAnswer(`${yield* $(publicRepos)}`)
  })

  //Handle parallelism, define how many Effects I want to run in parallel
  const manyManyEffects = mockUserNames.map(
    flow(
      fetchUser,
      Effect.delay(Duration.seconds(3)),
      Effect.orElse(() => Effect.succeed('nothing'))
    )
  )
  const chunkEffects = pipe(
    Effect.allPar(manyManyEffects),
    Effect.withParallelism(2)
  )

  return (
    <Layout
      title="Effect"
      subtitle="A functional effect system for TypeScript "
    >
      <ColumnLayout columns={2}>
        <Container>
          <h2>Effect</h2>
          <p>The Effect is also lazy</p>
          <p>Data type for Effect is: Effect{`<R, E, A>`}</p>
          <p>{`(r: R) => Promise<Either<E, A>> | Either<E, A>`}</p>
          <p>Effect, Error handling, Generators, Fibers</p>
          <h3>Result of the Effect:</h3>
          <h2
            style={{
              fontSize: '50px',
              display: 'inline',
              lineHeight: 1,
            }}
          >
            {answer}
          </h2>
        </Container>

        <Container>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => Effect.runPromise(getUserNames)}
            >
              Run Effect
            </Button>
          </Box>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => Effect.runPromise(sumAllPublicRepos)}
            >
              Get All Public Repos
            </Button>
          </Box>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => Effect.runPromise(chunkEffects)}
            >
              Chunk Effects
            </Button>
          </Box>
        </Container>
      </ColumnLayout>
    </Layout>
  )
}
