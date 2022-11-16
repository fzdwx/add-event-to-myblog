import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'

// @ts-ignore
import {Context} from '@actions/github/lib/context'
import * as fs from "fs";
import {issueToContent, IssueWorker} from "./issue";

async function run(): Promise<void> {
    try {
        let args = parseArgs()

        const worker = new IssueWorker(args, github.context)
        const authName = await worker.authName();
        const issueInfo = await worker.readIssue();

        if (!args.public && authName != issueInfo.author) {
            core.info(`is not auth user posts! auth: ${authName}, author: ${issueInfo.author} `)
            return
        }

        const filepath = `content/notes/${issueInfo.id}.md`

        fs.mkdir(`content/notes`, emptyCallback)

        let action = issueInfo.isOpen() ? "add" : "rm";
        fs.appendFile(filepath, issueToContent(issueInfo), afterAppendFile(args, filepath, action));

    } catch (err: any) {
        core.setFailed(err.message)
    }
}


function parseArgs(): UserArgs {
    return {
        token: core.getInput('token'),
        username: core.getInput('username'),
        email: core.getInput('email'),
        issueNumber: core.getInput('issueNumber'),
        public: core.getBooleanInput("public")
    }
}

function emptyCallback() {

}

function afterAppendFile(args: UserArgs, filepath: string, action: string) {
    return async function () {
        await exec.exec(`git config --global user.email ${args.email}`)
        await exec.exec(`git config --global user.name ${args.username}`)
        await exec.exec(`git ${action} ${filepath}`)
        await exec.exec(`git commit -m update-notes`)
        await exec.exec(`git push`)
    };
}

run()
