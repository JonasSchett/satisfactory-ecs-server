#!/bin/sh
if [ -z "${APP_NAME}" ]; then
    echo "ERROR: Variable APP_NAME not set, set as an env variable as part of startup or through the Dockerfile"
    exit 1
elif [ -z "${BUCKET_NAME}" ]; then
    echo "ERROR: Variable BUCKET_NAME not set, set as an env variable as part of startup or through the Dockerfile"
    exit 1
fi

accountId="$(aws sts get-caller-identity | jq -r '.Account')"
if [ -z "${accountId}" ]; then
    echo "ERROR: Could not fetch accountId, make sure you are running this in an AWS account and/or have relevant permission to call aws sts get-caller-identity"
    exit 1
fi

echo "Syncing items from bucket: ${APP_NAME}-${accountId}-${BUCKET_NAME}"
aws s3 sync s3://${APP_NAME}-${accountId}-${BUCKET_NAME}/saved /config/saved

while :
do
    sleep 600
    echo "Syncing saves to S3 bucket ${APP_NAME}-${accountId}-${BUCKET_NAME}"
    aws s3 sync /config/saved s3://${APP_NAME}-${accountId}-${BUCKET_NAME}/saved
done