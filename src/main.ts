import * as core from '@actions/core'
import * as github from '@actions/github'
import {Octokit} from '@octokit/rest'

// @ts-ignore
import {Context} from '@actions/github/lib/context'
// @ts-ignore
import {THANKS} from 'actions-util'

async function run(): Promise<void> {
  try {
    let args = getArgs()

    let worker = new IssueWorker(args, github.context)

    await worker.readIssue()
    core.info(`\n${THANKS}`)
  } catch (err: any) {
    core.setFailed(err.message)
  }
}

interface UserArgs {
  token: string
  username: string
  email: string
  issueNumber: string
}

class IssueWorker {
  args: UserArgs
  octokit: Octokit
  repo: string
  owner: string
  issue_number: number

  constructor(args: UserArgs, ctx: Context) {
    this.args = args
    this.repo = ctx.repo.repo
    this.owner = ctx.repo.owner
    this.issue_number = +args.issueNumber
    this.octokit = new Octokit({auth: `token ${args.token}`})
  }

  async test() {
    const {octokit} = this

    const {
      data: {login}
    } = await octokit.rest.users.getAuthenticated()
    core.info('Hello ' + login)
  }

  async readIssue() {
    const {octokit, owner, repo, issue_number} = this

    const {data} = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number
    })

    let body = ''
    if (data.body != undefined) {
      body = data.body
    }

    core.info('get issue body' + body)
    core.info(data.title)
    core.info('get lables: ' + data.labels.join(','))
  }
}

function getArgs(): UserArgs {
  return {
    token: core.getInput('token'),
    username: core.getInput('username'),
    email: core.getInput('email'),
    issueNumber: core.getInput('issueNumber')
  }
}

run()
