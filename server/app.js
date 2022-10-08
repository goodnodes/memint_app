const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const wallet = require("./routes/wallet");
const transactionRouter = require("./routes/transaction");
const auth = require("./routes/auth");
// const mintNFT = require("./routes/mintNFT");
const notification = require("./routes/notification");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = process.env.PORT || 5000;
const web = require("./routes/web");
const schedule = require("node-schedule-tz");
// const cors = require("cors");
// let corsOptions = {
//   origin: "https://www.memint.xyz",
//   credentials: true,
// };

//Firebase setting
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const serviceAccount = require("./key/memint-c2130-firebase-adminsdk-p6jhw-39f8a3b04b.json");

const firebaseApp = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = (module.exports.db = firestore.getFirestore(firebaseApp));
//Firebase setting

app.use(logger("dev"));
app.use(
	cors({
		origin: [
			"https://main--tangerine-tartufo-e315f3.netlify.app",
			"https://www.memint.xyz",
		],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.send("hello Web3");
});

app.use("/web", web);
app.use("/auth", auth);
app.use("/wallet", wallet);
app.use("/transaction", transactionRouter);
// app.use("/mintNFT", mintNFT);
app.use("/notification", notification);
app.use("/notification", notification);
// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		errors: {
			message: err.message,
		},
	});
});

// const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 23;
rule.minute = 59;
rule.tz = "Asia/Seoul";
// const j = schedule.scheduleJob("*/10 * * * * *", async function () {
const j = schedule.scheduleJob(rule, async function () {
	try {
		console.log("Reset validity for supplying free TING token");
		let querySnapshot = await db.collection("User").get();

		if (querySnapshot.size === 0) {
			console.log("No documents to update");
			return "No documents to update";
		}

		const batches = []; // hold batches to update at once

		querySnapshot.docs.forEach((doc, i) => {
			if (i % 500 === 0) {
				batches.push(db.batch());
			}

			const batch = batches[batches.length - 1];
			batch.update(doc.ref, { isReadyToGetFreeToken: true });
		});

		await Promise.all(batches.map((batch) => batch.commit()));
		console.log(`${querySnapshot.size} documents updated`);
		return `${querySnapshot.size} documents updated`;
	} catch (error) {
		console.log(`***ERROR: ${error}`);
		return error;
	}
});

app.listen(port, () => {
	console.log(`Memint Server listening at http://localhost:${port}`);
});

module.exports = app;
