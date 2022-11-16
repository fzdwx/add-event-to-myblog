import {Octokit} from "@octokit/rest";
import {Context} from "@actions/github/lib/context";

export class IssueWorker {
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

    async authName() {
        const {octokit} = this

        const {
            data: {login}
        } = await octokit.rest.users.getAuthenticated()

        return login
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
        if (data.labels != undefined && data.labels.length >= 1) {
            tags = data.labels.map(item => {
                // @ts-ignore
                return item.name
            });
        }

        let author = this.owner;
        if (data.user) {
            author = data.user.name || this.owner
        }
        return {
            getTagsString(): string {
                return JSON.stringify(tags);
            },
            body,
            tags,
            author: author,
            title: data.title,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            id: issue_number,
            isOpen(): Boolean {
                return "open" == data.state;
            },
        }
    }
}

export function issueToContent(issueInfo: IssueInfo) {
    return `---
title: "${issueInfo.title}"
date: "${issueInfo.createdAt}"
updated: ${issueInfo.updatedAt}
categories: ${issueInfo.getTagsString()}
---
${issueInfo.body}`;
}