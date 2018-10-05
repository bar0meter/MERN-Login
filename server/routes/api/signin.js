const router = require("express").Router();
const User = require("../../models/User.js");
const UserSession = require("../../models/UserSession.js");
const mongoose = require("mongoose");

router.post("/accounts/signup", async (req, res) => {
	const { firstName, lastName, password } = req.body;
	let { email } = req.body;

	if (!firstName)
		return res
			.status(400)
			.send({ success: false, message: "First name cannot be null" });

	if (!lastName)
		return res
			.status(400)
			.send({ success: false, message: "Last name cannot be null" });

	if (!email)
		return res
			.status(400)
			.send({ success: false, message: "Email name cannot be null" });

	if (!password)
		return res
			.status(400)
			.send({ success: false, message: "Password name cannot be null" });

	email = email.toLowerCase();

	const result = await User.find({
		email: email
	});

	if (!result)
		res.status(400).send({ success: false, message: "Account already exists" });
	else {
		let newUser = new User({
			email: email,
			firstName: firstName,
			lastName: lastName
		});

		newUser.password = newUser.generateHash(password);
		try {
			await newUser.save();
			res.send({ success: true, message: "User successfully created" });
		} catch (err) {
			console.error("Error : ", err);
		}
	}
});

router.post("/accounts/signin", async (req, res) => {
	const { password } = req.body;
	let { email } = req.body;

	if (!email)
		return res
			.status(400)
			.send({ success: false, message: "Email name cannot be null" });

	if (!password)
		return res
			.status(400)
			.send({ success: false, message: "Password name cannot be null" });

	email = email.toLowerCase();

	const result = await User.findOne({ email: email });
	if (!result) return res.status(400).send("User not found");

	if (!result.validPassword(password))
		return res
			.status(400)
			.send({ success: false, message: "Invalid Password" });

	let userSession = new UserSession();
	userSession.userId = result._id;

	try {
		const doc = await userSession.save();
		res.send({ success: true, message: "Valid Sign In", token: doc._id });
	} catch (err) {
		console.error("Error : ", err);
	}
});

router.get("/accounts/verify", async (req, res) => {
	const { token } = req.query;
	if (!mongoose.Types.ObjectId.isValid(token)) {
		return res.send({ success: false, message: "Invalid Token" });
	}

	try {
		const result = await UserSession.findOne({ _id: token, isDeleted: false });
		if (!result)
			return res
				.status(400)
				.send({ success: false, message: "Some error occured" });
		else return res.send({ success: true, message: "Good" });
	} catch (err) {
		console.error("Error : ", err);
		res.send({ success: false, message: "Some error occured" });
	}
});

module.exports = router;
