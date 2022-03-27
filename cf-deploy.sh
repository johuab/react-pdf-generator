#!/bin/sh -e

BUILD_FOLDER=build

# Parse and validate arguments
usage() {
  echo "Usage: $0 [-t <template name>] [-p <gcloud project id>]" 1>&2
  exit 1
}

while getopts ":t:p:" o; do
    case "${o}" in
        p)
            project_id=${OPTARG}
            ;;
        t)
            template=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))

if [ -z "${project_id}" ] || [ -z "${template}" ]; then
    usage
fi

# Validate environment
if ! command -v gcloud &> /dev/null; then
    echo "gcloud could not be found"
    exit 1
fi

# Build and generate function
yarn run build
cp package.json $BUILD_FOLDER # Must be included for cloud function to be able to load dependancies

# Generate function source
function_name=generate$(echo $template | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2,length($0)))}')

echo "import {
  Request,
  Response,
} from 'express';

import { streamTemplateByName } from './utils/stream-template';

export const ${function_name} = (req: Request, res: Response) => {
  streamTemplateByName('${template}', req, res);
};" >  $BUILD_FOLDER/index.ts
node_modules/.bin/tsc $BUILD_FOLDER/index.ts #T ranspile function source to javascript

rm $BUILD_FOLDER/index.ts # Remove ts file, we do not want that in the deployment

# Deploy!
pushd build

gcloud functions deploy $function_name \
  --project="$project_id" \
  --region="europe-west1" \
  --memory="128MB" \
  --trigger-http \
  --runtime=nodejs12 \

popd

# We are done!
echo "$name is deployed and ready for usage!"