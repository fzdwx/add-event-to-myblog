import * as core from '@actions/core'
import {getArgs} from "./args";

async function run(): Promise<void> {
    let args = getArgs();
    core.info("mytoken:==============="+args.token)
    core.info(args.username)
    core.info(args.username)
}

run()
