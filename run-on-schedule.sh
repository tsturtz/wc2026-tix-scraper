#!/bin/bash

while :
do
  node index.js
  echo "Sleeping for [$WC_BOT_SLEEP_SECONDS] seconds"
  sleep $WC_BOT_SLEEP_SECONDS
done
