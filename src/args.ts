import {UserArgs} from "./type";
import core from "@actions/core"

export function getArgs(): UserArgs {
    return {
        token: core.getInput('token'),
        username: core.getInput('username'),
        email: core.getInput('email'),
    }
}