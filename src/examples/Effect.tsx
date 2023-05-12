import React, { useState } from 'react'
import * as Effect from "@effect/io/Effect";
import { flow, pipe } from "@effect/data/Function";
import * as RA from "@effect/data/ReadonlyArray";
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
import { GithubUser, UserNumbers } from '../common/types';

export const EffectTs = () => {
  const [answer, setAnswer] = useState<string>('')

  const fetchUser = (user: string): Effect.Effect<never, BadRequest | BadJson | InvalidGithubUser, GithubUser> => pipe(
    Effect.tryCatchPromise(
      () => fetch(`${GITHUB_API}/${user}`),
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
    fetchUser('natar10'),
    Effect.catchTag("InvalidGithubUser", e =>
      Effect.succeed([`recover from ${e._tag}`, e.value] as const))
  )

  //Catch InvalidGithubUser but return another error called OnlyUserAllowed
  const catchInvalidReturnError = pipe(
    fetchUser('natar10'),
    Effect.catchTag("InvalidGithubUser", e =>
      Effect.fail(new OnlyUserAllowed(e.value))
    ))

  //Recover from all the errors all at once
  const catchAll = pipe(fetchUser('natar10'), Effect.catchAll(e =>
    Effect.succeed(["recover", e._tag] as const),
  ))

  //Fallback
  const fallback = pipe(
    fetchUser('natar10'),
    Effect.orElse(() => Effect.succeed("If something fails just show this string"))
  )


  /* Concurrency */

  const effects = ['natar10', 'stackbuilders', 'Effect-TS'].map(fetchUser);

  const example4 = Effect.gen(function* ($) {
    // Here we can resolve the async operations in parallel and we get an array of the final value
    const ids = yield* $(Effect.allPar(effects));
    setAnswer(ids.reduce((acc, a) => `${a.name} - ${acc}`, ''));

    // Here instead we can only collect the operations that actually return something
    // We turn it into an optional and collectAllPar collects only the elements where effect return a some
    const effects2 = effects.map(flow(Effect.map(Option.some)));
    const cids = yield* $(Effect.collectAllPar(effects2));
    console.log('cids', cids);
  });

  const sumAllPublicRepos = Effect.gen(function* ($) {
    //There are many operators that work in parallel. 
    //We can model the Effect and then reduce it to a single effect working in parallel
    const publicRepos = pipe(
      effects,
      RA.map(effect => Effect.map(effect, user => user.public_repos)),
      RA.map(effect => Effect.catchAll(effect, _ => Effect.succeed(0))),
      Effect.reduceAllPar(Effect.succeed(0), (acc, a) => acc + a),
    );
    setAnswer(`${(yield* $(publicRepos))}`);
  });

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
          <p>Effect, Error  handling, Generators, Fibers</p>
          <h3>Result of the Effect:</h3>
          <h2 style={{ fontSize: '50px', display: 'inline', lineHeight: 1 }}>{answer}</h2>
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
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => Effect.runPromise(sumAllPublicRepos)}
            >
              Get All Public Repos
            </Button>
          </Box>
        </Container>
      </ColumnLayout>
    </Layout>
  )
}
