# wc2026-tix-scraper

### Required env vars

- WC_BOT_SLACK_USER_ID        (user id so it can ping in slack)
- WC_BOT_SLACK_WEBHOOK_URL    (slack webhook url)

### Run in background

_Currently in /usr/local/bin_

Run:

```
nohup ./run-on-schedule.sh &
```

Kill:

```
ps -ef | grep ./run-on-schedule.sh
# then
kill -9 <the PID>
```
