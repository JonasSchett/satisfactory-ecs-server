# Satisfactory server run on ECS and backing up data to S3
To launch, connect to  you aws account with aws configure (https://docs.aws.amazon.com/cli/latest/reference/configure/)

Run, in order:
1. cdk bootstrap
2. cdk synth
3. cdk deploy

Check ECS in the AWS console and look up the IP of the task to join the server
