# Satisfactory server run on ECS and backing up data to S3
To launch, connect to  you aws account with aws configure (https://docs.aws.amazon.com/cli/latest/reference/configure/)

Run, in order:
1. cdk bootstrap
2. cdk synth
3. cdk deploy

Check ECS in the AWS console and look up the IP of the task to join the server

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful cdk commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
