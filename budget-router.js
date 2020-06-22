const express = require("express")
const db = require ("./data/dbConfig")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM "messages";`
		const accounts = await db.select("*").from("accounts")
		res.json(accounts)
	} catch (err) {
		next(err)
	}
})


router.get("/:id", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM "messages" WHERE "id" = ? LIMIT 1;`
		// descructure the result since we only care about the first index of the array
		const [account] = await db
			.select("*")
			.from("accounts")
			.where("id", req.params.id)
			// make sure we're only getting a single result,
			// since we're destructuring the array above
			.limit(1)

		res.json(account)
	} catch (err) {
		next(err)
	}
})

router.post("/", async (req, res, next) => {
	try {
		const payload = {
			// the database will automatically generate the ID and dates
			name: req.body.name,
			budget: req.body.budget,
		}

		// translates to `INSERT INTO "messages" ("title", "contents") VALUES (?, ?);`
		const [accountID] = await db.insert(payload).into("accounts")
		// calling `.first()` is doing the same thing as `.limit(1)` and destructuring the result
		const account = await db.first("*").from("accounts").where("id", accountID)

		res.status(201).json(account)
	} catch (err) {
		next(err)
	}
})

router.put("/:id", async (req, res, next) => {
	try {
		const payload = {
      name: req.body.name,
			budget: req.body.budget,
		}

		// translates to `UPDATE "messages" SET ? = ? WHERE "id" = ?;`
		await db("accounts").update(payload).where("id", req.params.id)
		const account = await db.first("*").from("accounts").where("id", req.params.id)

		res.json(account)
	} catch (err) {
		next(err)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		// translates to `DELETE FROM "messages" WHERE "id" = ?;`
		await db("accounts").where("id", req.params.id).del()
		// since we no longer have a resource to return,
		// just send a 204 which means "success, but no response data is being sent back"
		res.status(204).end()
	} catch (err) {
		next(err)
	}
})


module.exports = router