# Satisfactory ECS Server

This repository contains the infrastructure and application code to run a Satisfactory dedicated server on AWS Elastic Container Service (ECS). It automates the deployment of the server, including persistent storage for game saves through S3 backups.

## Prerequesites

1. Docker needs to be installed on your local machine, it will be used to build the image we then deploy to ECS
1.2. Ensure your user is able to execute docker commands, otherwise the build will fail

## Configuratin

You can configure some parameters inside ./lib/SatisfactoryEcsServerStack.ts:
    MAX_PLAYERS = define max players for server;
    STEAM_BETA = whether or not to use the beta build of satisfactory server;
    APP_NAME = name of the app;
    BUCKET_NAME = bucket where save-games are stored to

## Deployment

To launch, connect to your AWS account with `aws configure` or `aws configure sso` (https://docs.aws.amazon.com/cli/latest/reference/configure/ or https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

Run, in order:
1. `cdk bootstrap`
2. `cdk synth`
3. `cdk deploy`

If you configured through sso,
1. `cdk bootstrap --profile {your-profile}`
2. `cdk synth --profile {your-profile}`
3. `cdk deploy --profile {your-profile}`

Check ECS in the AWS console and look up the IP of the task to join the server.

## S3 Backup Mechanism

The server automatically backs up game saves to an S3 bucket and restores them on startup. This ensures data persistence even if the ECS task is stopped or restarted.

The backup process is handled by the `app/sync.sh` script within the Docker container.

- **Initial Sync**: On startup, the server syncs saved games from `s3://${APP_NAME}-${accountId}-${BUCKET_NAME}/saved` to `/config/saved`.
- **Continuous Backup**: Every 10 minutes (600 seconds), the server syncs the local `/config/saved` directory to the S3 bucket `s3://${APP_NAME}-${accountId}-${BUCKET_NAME}/saved`.

The `APP_NAME` and `BUCKET_NAME` variables must be set as environment variables during startup or through the Dockerfile. The `accountId` is automatically fetched using `aws sts get-caller-identity`.
To launch, connect to  you aws account with aws configure (https://docs.aws.amazon.com/cli/latest/reference/configure/)

Run, in order:
1. cdk bootstrap
2. cdk synth
3. cdk deploy

Check ECS in the AWS console and look up the IP of the task to join the server
