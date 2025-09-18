#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-to-do-organizer-16812-16824/to_do_list_web_frontend
npx eslint 
$ESLINT_EXIT_CODE
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

