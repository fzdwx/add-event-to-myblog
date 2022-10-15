import * as core from '@actions/core'
import * as github from '@actions/github'
import {Octokit} from '@octokit/rest'

// @ts-ignore
import {Context} from '@actions/github/lib/context'

async function run(): Promise<void> {
    try {
        let args = getArgs()

        let worker = new IssueWorker(args, github.context)

        let issueInfo = await worker.readIssue();

        core.info("get issue info :\n" + JSON.stringify(issueInfo))
        core.info(`\n success`)
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

interface IssueInfo {
    title: string
    body: string
    tags: string[]
    createdAt: string
    updatedAt: string
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

    async readIssue(): Promise<IssueInfo> {
        const {octokit, owner, repo, issue_number} = this

        const {data} = await octokit.rest.issues.get({
            owner,
            repo,
            issue_number
        })

        let body = data.body || '';
        let tags: string[] = []
        if (data.labels != undefined && data.labels.length > 1) {
            tags = data.labels.map(item => {
                // @ts-ignore
                return item.name
            });
        }

        let createdAt = data.created_at;
        let updatedAt = data.updated_at;

        return {
            body, tags, title: data.title, createdAt, updatedAt
        }
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
