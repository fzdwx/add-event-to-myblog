// @ts-ignore
import * as core from '@actions/core'
// @ts-ignore
import {Octokit} from '@octokit/rest';

interface UserArgs {
    token: string,
    username: string,
    email: string
    issueNumber: string
}

async function run(): Promise<void> {
    let args = getArgs();
    core.info("token============" + args.token);
    core.info("name===================" + args.username);
    core.info("email===========" + args.email);
    core.info("issue number ===========" + args.issueNumber);
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
