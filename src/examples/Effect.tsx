import React, { useState } from 'react'
import * as Effect from "@effect/io/Effect";
import { pipe } from "@effect/data/Function";
import * as Option from "@effect/data/Option";

import {
  Box,
  Button,
  ColumnLayout,
  Container,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import { GITHUB_API } from '../utils/constants';
import { BadJson, BadRequest, InvalidGithubUser, isUser, OnlyUserAllowed, parseGithubUser } from '../common/decode'
import { GithubUser } from '../common/types';

export const EffectTs = () => {

  const fetchUser: Effect.Effect<never, BadRequest | BadJson | InvalidGithubUser, GithubUser> = pipe(
    Effect.tryCatchPromise(
      () => fetch(`${GITHUB_API}/natar10`),
      (e) => new BadRequest(e),
    ),
    Effect.flatMap(res => Effect.tryCatchPromise(
      () => res.json() as Promise<unknown>,
      (e) => new BadJson(e),
    )),
    Effect.flatMap(parseGithubUser),
  )

  //Recover from one of those failures, we can use catchTag
  const catchInvalidUser = pipe(
    fetchUser,
    Effect.catchTag("InvalidGithubUser", e =>
      Effect.succeed([`recover from ${e._tag}`, e.value] as const))
  )

  //Catch InvalidGithubUser but return another error called OnlyUserAllowed
  const catchInvalidReturnError = pipe(
    fetchUser,
    Effect.catchTag("InvalidGithubUser", e =>
      Effect.fail(new OnlyUserAllowed(e.value))
    ))

  //Recover from all the errors all at once
  const catchAll = pipe(fetchUser, Effect.catchAll(e =>
    Effect.succeed(["recover", e._tag] as const),
  ))

  //Fallback
  const fallback = pipe(
    fetchUser,
    Effect.orElse(() => Effect.succeed("If something fails just show this string"))
  )


  /* Concurrency */

  const effects = [fetchUser];

  const example4 = Effect.gen(function* ($) {
    //pipe(effects, Effect.collectAllPar(effects)  )

    const ids = yield* $(Effect.allPar(effects));

    console.log('ids', ids);

    const effects2 = effects.map(effect => pipe(effect, Effect.map(Option.some)));
    //    ^ Effect<never, never, Option<Identifier>>[]

    const cids = yield* $(Effect.collectAllPar(effects2));
    //    ^ Identifier[]

    console.log('cids', cids);
  });

  return (
    <Layout
      title="Effect"
      subtitle="A functional effect system for TypeScript "
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

        <Container>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => Effect.runPromise(example4)}
            >
              Run Effect
            </Button>
          </Box>
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
