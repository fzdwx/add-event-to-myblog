import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'
import {Octokit} from '@octokit/rest'

// @ts-ignore
import {Context} from '@actions/github/lib/context'
import * as fs from "fs";

async function run(): Promise<void> {
    try {
        let args = getArgs()

        let worker = new IssueWorker(args, github.context)

        let issueInfo = await worker.readIssue();

        let content = `---
layout: post
title: "${issueInfo.title}"
date: "${issueInfo.createdAt}"
tags: ${issueInfo.tags.toString()}
---
${issueInfo.body}`;

        const filepath = `content/notes/${issueInfo.id}.md`

        fs.mkdir(`content/notes`, () => {
        })

        fs.rm(filepath, () => {

            fs.appendFile(filepath, content, () => {
                core.info("success save: " + filepath);

                exec.exec(`git config --global user.email ${args.email}`)
                exec.exec(`git config --global user.name ${args.username}`)
                exec.exec(`git add ${filepath}`)
                exec.exec(`git commit -m notes:${issueInfo.id}-${issueInfo.title} `)
                exec.exec(`git push`)
            })
        })

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
    id: number
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

        return {
            body,
            tags,
            title: data.title,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            id: issue_number
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
