#!/bin/bash

COUNT=1

while :
do
  export COUNT;
  echo "Run count: $COUNT"
  node index.ts
  ((COUNT++))
  echo "Sleeping for [$WC_BOT_SLEEP_SECONDS] seconds"
  sleep 3000
done
