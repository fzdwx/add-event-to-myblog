// @ts-ignore
import * as core from '@actions/core'
// @ts-ignore
import {Octokit} from '@octokit/rest';

async function run(): Promise<void> {
    let args = getArgs();

    let worker = new IssueWorker(args);

    await worker.test()
}

interface UserArgs {
    token: string,
    username: string,
    email: string
    issueNumber: string
}

class IssueWorker {
    args: UserArgs
    octokit: Octokit

    constructor(args: UserArgs) {
        this.args = args;
        this.octokit = new Octokit({auth: `token ${args.token}`})
    }

    async test() {
        const {octokit} = this;

        const {
            data: {login},
        } = await octokit.rest.users.getAuthenticated();
        core.info("Hello " + login)
    }
}


function getArgs(): UserArgs {
    return {
        token: core.getInput('token'),
        username: core.getInput('username'),
        email: core.getInput('email'),
        issueNumber: core.getInput("issueNumber")
    }
}


run()
