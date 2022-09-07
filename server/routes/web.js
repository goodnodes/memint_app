const express = require("express");
const web = express.Router();
const app = require("../app");

web.route("/").get(async (req, res) => {
  try {
    const datas = await app.db
      .collection("Meeting")
      .orderBy("createdAt", "desc")
      .limit(6)
      .get();

    const data = await Promise.all(
      datas.docs.map(async (el) => {
        const meetingInfo = el.data();
        const hostInfo = await app.db
          .collection("User")
          .doc(meetingInfo.hostId)
          .get();

        return {
          meetingInfo:{
            ...meetingInfo,
            meetDate: meetingInfo.meetDate.toDate().toISOString()
          },
          hostInfo: {
            nickName: hostInfo.data().nickName,
            profile: hostInfo.data().nftProfile,
            age: hostInfo.data().birth,
          },
        };
      })
      // .then(console.log)
    );

    res.send({ data });
  } catch (error) {
    console.error(error);
  }
});

module.exports = web;
