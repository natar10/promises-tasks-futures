// src/mocks/handlers.js
import { rest } from 'msw'
import { GITHUB_API } from '../utils/constants'
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
]