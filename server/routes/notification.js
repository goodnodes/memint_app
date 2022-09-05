const express = require("express");
const notification = express.Router();
const admin = require("firebase-admin");
// const db = getFirestore();
const app = require("../app");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { DISCORD_TOKEN } = process.env;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_TOKEN);

async function onUserCreateAlarm(receiver, message, title) {
  //get receiver's details
  const owner = await admin.firestore().collection("User").doc(receiver).get();
  const messageData = {
    notification: { title: title, body: message },
    tokens: owner.data().deviceTokens,
  };

  return await admin
    .messaging()
    .sendMulticast(messageData)
    .then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(owner.data().deviceTokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
    });
}

const onCreateConfirmDiscord = (sender) => {
  const messageEmbed = new EmbedBuilder()
    .setTitle("미팅 인증 요청이 도착했습니다!")
    .setURL("https://main--tangerine-tartufo-e315f3.netlify.app/")
    .setDescription(
      `${sender}님의 요청이 도착했습니다. 관리자의 인증이 필요합니다.`
    )
    .setTimestamp();
  return client.channels.cache
    .get("1016207201087541329")
    .send({ embeds: [messageEmbed] });
};

notification.route("/").post((req, res) => {
  onUserCreateAlarm(req.body.receiver, req.body.message, req.body.title)
    .then((alarm) => {
      res.status(200).send("success!");
    })
    .catch((err) => {
      console.log(err);
    });
});

notification.route("/confirm").post((req, res) => {
  onCreateConfirmDiscord(req.body.sender)
    .then(() => {
      res.status(200).send("success!");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = notification;
