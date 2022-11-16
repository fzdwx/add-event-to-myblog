interface UserArgs {
    token: string
    username: string
    email: string
    issueNumber: string
    public: boolean
}

interface IssueInfo {
    id: number
    title: string
    body: string
    tags: string[]
    author: string
    createdAt: string
    updatedAt: string

    getTagsString(): string;

     isOpen(): Boolean;
}