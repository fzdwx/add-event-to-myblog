// @ts-ignore
import * as core from '@actions/core'

interface UserArgs {
  token: string,
  username: string,
  email: string
}

async function run(): Promise<void> {
  let args = getArgs();
  core.info("token============" + args.token);
  core.info("name===================" + args.username);
  core.info("email===========" + args.email);
}

function getArgs(): UserArgs {
  return {
    token: core.getInput('token'),
    username: core.getInput('username'),
    email: core.getInput('email'),
  }
}

run()
