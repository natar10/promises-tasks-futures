import React from 'react'
import { useEffect, useState } from 'react'
import { GithubUser } from '../types'
import {Button, ColumnLayout, Container} from "@cloudscape-design/components";
import { Layout } from '../components/Layout';

const GITHUB_API = 'https://api.github.com/users'

export const Lazy = () => {
    const [repo, setRepo] = useState<GithubUser>()

    const normalPromise = () => {
      fetch(`${GITHUB_API}/natar10`)
        .then(response => response.json())
        .then(data => setRepo(data))
        .catch(e => console.log(e))
    }

    return (
    <Layout title='Laziness' subtitle='Lets see the difference'>
        <ColumnLayout columns={2}>
            <Container>
                <h2>Promise</h2>
                <Button onClick={normalPromise}>Call Promise</Button>
                {repo &&
                <ul>
                    <li>{repo.name}</li>
                    <li>{repo.created_at}</li>
                    <li>{repo.id}</li>
                </ul>
                }
            </Container>
            <Container>
                <h2>Task</h2>
                <Button>Run Task</Button>
            </Container>
        </ColumnLayout>
    </Layout>
    )
  return <h1>Lazy</h1>
}
