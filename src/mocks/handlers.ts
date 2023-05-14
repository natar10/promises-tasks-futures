// src/mocks/handlers.js
import { rest } from 'msw'
import { FAIL_GITHUB_API, GITHUB_API } from '../utils/constants'
import { mockUser, mockRepos } from './ghMocks'

export const handlers = [
  rest.get(`${GITHUB_API}/:userId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockUser)
    )
  }),
  rest.get(`${GITHUB_API}/:userId/repos`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockRepos)
    )
  }),
  rest.get(`${FAIL_GITHUB_API}/failed`, (req, res, ctx) => {
    return res(ctx.status(404, 'You API is bad'))
  })
]
