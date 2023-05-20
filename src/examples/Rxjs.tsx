import React, { useState } from 'react'
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Link,
} from '@cloudscape-design/components'
import { Layout } from '../components/Layout'
import {
  map,
  Subscription,
  switchMap,
  tap,
  retry,
  Subject,
} from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { GITHUB_API } from '../utils/constants'
import { GithubRepo, GithubUser } from '../common/types'

export const Rxjs = () => {
  const [answer, setAnswer] = useState<GithubUser>()
  const [subscriber, setSubscriber] = useState<Subscription>()
  const [stars, setStars] = useState<Array<GithubRepo>>([])
  const [forked, setForked] = useState<Array<GithubRepo>>([])

  //We can define an observable from a fetch
  //There are many ways to define an observable sync or async
  const observableFromPromise = fromFetch(
    `${GITHUB_API}/natar10`
  ).pipe(
    switchMap(r => r.json()),
    map(setAnswer)
  )
  const subscribeObservable = (): Subscription =>
    observableFromPromise.subscribe()

  //We can define retries if the fetch failed
  const retryObservable = fromFetch(`${GITHUB_API}/natar10`).pipe(
    tap(response => {
      if (response.ok) {
        throw new Error('This is an error sent from the observable')
      }
    }),
    retry(2),
    switchMap(r => r.json()),
    map(setAnswer)
  )
  const retryAndSubscribe = () => retryObservable.subscribe()

  //As similar as the futures we can "cancel" unsubscribe from an observable
  const cancelObservable = () => {
    subscriber?.unsubscribe()
  }

  //Subject
  //It a type Oservable that can be multicasted to many observers
  //Is able to broadcast new values to subscribers using next
  const subject = new Subject<Array<GithubRepo>>()
  subject.subscribe({
    next: v => setStars(v.filter(x => x.stargazers_count > 5)),
  })
  subject.subscribe({
    next: v => setForked(v.filter(x => x.forks_count > 5)),
  })
  const reposObservable = fromFetch(
    `${GITHUB_API}/stackbuilders/repos`
  ).pipe(switchMap(r => r.json()))

  const reposSubscribe = () => reposObservable.subscribe(subject)

  return (
    <Layout
      title="ReactiveX"
      subtitle="Functional programming, observer pattern and reactive programmig"
    >
      <ColumnLayout columns={2}>
        <Container>
          <h2>RxJs Observable</h2>
          <p>The Observable is also lazy</p>
          <p>Is it reactive</p>
          <p>You can create streams</p>
          <p>Compose functions</p>
          <h3>Result of the Observable:</h3>
          <h1 style={{ fontSize: '40px' }}>{answer?.name}</h1>
        </Container>
        <Container>
          <h2>Run the observable here</h2>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => setSubscriber(subscribeObservable)}
            >
              Subscribe Observable
            </Button>
          </Box>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => setSubscriber(retryAndSubscribe)}
            >
              Retry and Subscribe Observable
            </Button>
          </Box>
          <Box margin={{ bottom: 'xl' }}>
            <Button iconName="close" onClick={cancelObservable}>
              Cancel Observable
            </Button>
          </Box>
          <Box margin={{ bottom: 'xl' }}>
            <Button
              variant="primary"
              onClick={() => setSubscriber(reposSubscribe)}
            >
              Reveal best repos with Subject
            </Button>
          </Box>
        </Container>
      </ColumnLayout>
      <Box margin={{ top: 'xxl' }}>
        <Container variant="stacked">
          <ColumnLayout columns={2}>
            <Box>
              {stars?.length > 0 && (
                <ul>
                  <h3>Repos with more than 5 stars</h3>
                  {stars.map(repo => (
                    <li>
                      <Link key={repo.id} href={repo.url}>
                        {repo.name}
                      </Link>{' '}
                      ({repo.stargazers_count} stars)
                    </li>
                  ))}
                </ul>
              )}
            </Box>
            <Box>
              {stars?.length > 0 && (
                <ul>
                  <h3>Repos with more than 5 forks</h3>
                  {forked.map(repo => (
                    <li>
                      <Link key={repo.id} href={repo.url}>
                        {repo.name}
                      </Link>{' '}
                      ({repo.forks_count} forks)
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </ColumnLayout>
        </Container>
      </Box>
    </Layout>
  )
}
