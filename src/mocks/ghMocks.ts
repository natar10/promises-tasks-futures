import { faker } from '@faker-js/faker'
import { GithubRepo, GithubUser } from '../common/types'

export const mockUser: GithubUser = {
  login: faker.internet.userName(),
  id: parseInt(faker.string.uuid()),
  node_id: faker.string.uuid(),
  avatar_url: faker.internet.url(),
  gravatar_id: faker.string.uuid(),
  url: faker.internet.url(),
  html_url: faker.internet.url(),
  followers_url: faker.internet.url(),
  following_url: faker.internet.url(),
  gists_url: faker.internet.url(),
  starred_url: faker.internet.url(),
  subscriptions_url: faker.internet.url(),
  organizations_url: faker.internet.url(),
  repos_url: faker.internet.url(),
  events_url: faker.internet.url(),
  received_events_url: faker.internet.url(),
  type: ['User', 'Organization'][
    faker.number.int({ min: 0, max: 1 })
  ],
  site_admin: false,
  name: faker.person.fullName(),
  company: faker.company.name(),
  blog: faker.internet.url(),
  location: faker.location.country(),
  email: faker.internet.email(),
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: faker.number.int({ min: 0, max: 100 }),
  public_gists: faker.number.int({ min: 0, max: 100 }),
  followers: faker.number.int({ min: 0, max: 100 }),
  following: faker.number.int({ min: 0, max: 100 }),
  created_at: faker.date.anytime().toISOString(),
  updated_at: faker.date.anytime().toISOString(),
}

const githubRepo = (): GithubRepo => ({
  id: faker.number.int(),
  node_id: faker.string.uuid(),
  name: faker.music.songName(),
  full_name: faker.git.branch.name,
  private: false,
  owner: {
    login: faker.internet.userName(),
    id: faker.number.int(),
    node_id: faker.string.uuid(),
    avatar_url: faker.internet.url(),
    gravatar_id: faker.string.uuid(),
    url: faker.internet.url(),
    html_url: faker.internet.url(),
    followers_url: faker.internet.url(),
    following_url: faker.internet.url(),
    gists_url: faker.internet.url(),
    starred_url: faker.internet.url(),
    subscriptions_url: faker.internet.url(),
    organizations_url: faker.internet.url(),
    repos_url: faker.internet.url(),
    events_url: faker.internet.url(),
    received_events_url: faker.internet.url(),
    type: ['User', 'Organization'][
      faker.number.int({ min: 0, max: 1 })
    ],
    site_admin: false,
  },
  html_url: faker.internet.url(),
  description: faker.person.jobDescriptor(),
  fork: false,
  url: faker.internet.url(),
  forks_url: faker.internet.url(),
  keys_url: faker.internet.url(),
  collaborators_url: faker.internet.url(),
  teams_url: faker.internet.url(),
  hooks_url: faker.internet.url(),
  issue_events_url: faker.internet.url(),
  events_url: faker.internet.url(),
  assignees_url: faker.internet.url(),
  branches_url: faker.internet.url(),
  tags_url: faker.internet.url(),
  blobs_url: faker.internet.url(),
  git_tags_url: faker.internet.url(),
  git_refs_url: faker.internet.url(),
  trees_url: faker.internet.url(),
  statuses_url: faker.internet.url(),
  languages_url: faker.internet.url(),
  stargazers_url: faker.internet.url(),
  contributors_url: faker.internet.url(),
  subscribers_url: faker.internet.url(),
  subscription_url: faker.internet.url(),
  commits_url: faker.internet.url(),
  git_commits_url: faker.internet.url(),
  comments_url: faker.internet.url(),
  issue_comment_url: faker.internet.url(),
  contents_url: faker.internet.url(),
  compare_url: faker.internet.url(),
  merges_url: faker.internet.url(),
  archive_url: faker.internet.url(),
  downloads_url: faker.internet.url(),
  issues_url: faker.internet.url(),
  pulls_url: faker.internet.url(),
  milestones_url: faker.internet.url(),
  notifications_url: faker.internet.url(),
  labels_url: faker.internet.url(),
  releases_url: faker.internet.url(),
  deployments_url: faker.internet.url(),
  created_at: faker.date.anytime().toISOString(),
  updated_at: faker.date.anytime().toISOString(),
  pushed_at: faker.date.anytime().toISOString(),
  git_url: faker.internet.url(),
  ssh_url: faker.internet.url(),
  clone_url: faker.internet.url(),
  svn_url: faker.internet.url(),
  homepage: faker.internet.displayName(),
  size: faker.number.int({ min: 1000, max: 3000 }),
  stargazers_count: faker.number.int({ min: 0, max: 100 }),
  watchers_count: faker.number.int({ min: 0, max: 100 }),
  language: ['JavaScript', 'C++', 'TypeScript'][
    faker.number.int({ min: 0, max: 2 })
  ],
  has_issues: true,
  has_projects: true,
  has_downloads: true,
  has_wiki: true,
  has_pages: false,
  forks_count: faker.number.int({ min: 0, max: 100 }),
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: faker.number.int({ min: 0, max: 100 }),
  license: null,
  allow_forking: true,
  is_template: false,
  web_commit_signoff_required: false,
  topics: [],
  visibility: ['public', 'private'][
    faker.number.int({ min: 0, max: 1 })
  ],
  forks: 0,
  open_issues: 0,
  watchers: 0,
  default_branch: 'main',
})

export const mockRepos = [
  ...Array(faker.number.int({ min: 3, max: 5 })).keys(),
].map(_ => githubRepo())

export const mockUserNames = [...Array(20).keys()].map(x =>
  faker.internet.userName()
)
