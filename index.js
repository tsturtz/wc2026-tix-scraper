const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const { IncomingWebhook } = require('@slack/webhook');

const url = process.env.WC_BOT_SLACK_WEBHOOK_URL;

// Initialize slack webhook
const webhook = new IncomingWebhook(url);

const sendHealthCheckMessage = async () => {
  await webhook.send({"blocks": [
    {
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "WC2026TIX Bot: :heavy_check_mark: health check."
				}
			]
		}
  ]})
  .then((res) => { console.log('Health check notice sent successfully: ', res) })
  .catch((err) => { console.log('Error sending health check: ', err) });
}

const sendTestFailMessage = async () => {
  // Ping 3x cause wake up
  await webhook.send({"text": `<@${process.env.WC_BOT_SLACK_USER_ID}>`})
  .then((res) => { console.log('Pinged successfully: ', res) })
  .catch((err) => { console.log('Error pinging: ', err) });
  await webhook.send({"text": `<@${process.env.WC_BOT_SLACK_USER_ID}>`})
  .then((res) => { console.log('Pinged successfully: ', res) })
  .catch((err) => { console.log('Error pinging: ', err) });
  await webhook.send({"text": `<@${process.env.WC_BOT_SLACK_USER_ID}>`})
  .then((res) => { console.log('Pinged successfully: ', res) })
  .catch((err) => { console.log('Error pinging: ', err) });

  // Send the deets
  await webhook.send({
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "2026 World Cup tickets alert!",
        }
      },
      {
        "type": "image",
        "title": {
          "type": "plain_text",
          "text": "IT'S HAPPENING!",
        },
        "image_url": "https://media.tenor.com/igRLRCPgjvEAAAAC/its-happening-michael-scott.gif",
        "alt_text": "IT'S HAPPENING!"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":rotating_light: Something changed on the tickets page (https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/tickets)! Tickets _might_ now be on sale! :rotating_light:",
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Go check the site",
            },
            "style": "primary",
            "url": "https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/tickets",
          }
        ]
      }
    ]
  }).then((res) => {
    console.log('Message sent to slack. Response: ', res);
  }).catch((err) => {
    console.log('There was an error sending a message to slack: ', err)
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/tickets');
  await page.getByRole('button', { name: 'I\'m OK with that' }).click();

  try {
    await expect(page.getByText('Information regarding ticketing for the FIFA World Cup 2026™ will be available in due course.')).toBeVisible();
    await expect(page.getByText('Please check this page regularly for further updates.')).toBeVisible();

    console.log('Just checked the site and it is unchanged. Timestamp: ', new Date());

    if (Number(process.env.COUNT) % 24 === 0) {
      sendHealthCheckMessage();
    }
  } catch (e) {
    console.error('Playwright assertion failure: ', e);

    sendTestFailMessage();
  }

  await browser.close();
})();
