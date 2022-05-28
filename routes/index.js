var express = require('express');
var router = express.Router();
const sqlConnection = require('../connectionModules/db')


router.get("/allusers", async (req, res, next) => {

    try {
        const result = await sqlConnection.query("SELECT * FROM users")
        console.log(result);
        res.json(result)
    }
    catch (err) {
        console.log(err);
        res.json([])
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const { name, username, password, age, email } = req.body
        const existUser = await sqlConnection.query(`SELECT * FROM users WHERE username='${username}'`)
        if (existUser.length > 0) {
            return res.json({ message: "username alredy exist" })
        }
        let result = await sqlConnection.query(`
                INSERT INTO users ( username , password , name , age , email , isAdmin )
                VALUES ('${username}', '${password}', '${name}', '${age}', '${email}', 0);                
                `)
        res.json({ status: "success" })
    }
    catch (err) {
        console.log(err);
        res.json({ status: "failed" })
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { loginUsername, loginPassword } = req.body
        let result = await sqlConnection.query(`SELECT * FROM users WHERE username='${loginUsername}' and password='${loginPassword}'`)
        if (result.length > 0) {
            res.cookie("logged", Buffer.from(result[0].id + ":" + result[0].username).toString("base64"), {
                httpOnly: false,
            })
            res.json({ status: "success", isAdmin: result[0].isAdmin == 1 ? true : false })
        }
        else {
            res.json({ status: "failed" })
        }
        if (loginUsername || loginPassword === null) {
            console.log('Not found!');
            res.json({ message: "Wrong username or password", success: false })
        }
        else {
            res.json({ message: "Welcome" + loginUsername, success: true })
        }
    }
    catch (err) {
        res.json({ status: "error" })
    }
})

router.post("/tokenCheck", async (req, res, next) => {
    try {
        const { token } = req.body
        const decToken = Buffer.from(token, "base64").toString()
        const [id, username] = decToken.split(":")
        let result = await sqlConnection.query(`SELECT * FROM users WHERE username='${username}' and id='${id}'`)
        if (result.length > 0) {
            res.json({ status: "success", isAdmin: result[0].isAdmin == 1 ? true : false })
        }
        else {
            res.json({ status: "failed" })
        }
    }
    catch (err) {
        res.json({ status: "error" })

    }

})


router.post('/delete', async (req, res, next) => {
    try {
        let id = req.body.id
        let result = await sqlConnection.query(`DELETE FROM users WHERE id=${id}`)
        console.log(result);
        res.json({ status: "success" })
    }
    catch (err) {
        console.log(err);
        res.json({ status: "failed" })
    }
})

router.post('/edit', async (req, res, next) => {
    try {
        const { id, username, password, name, age, email, isAdmin } = req.body
        const existUser = await sqlConnection.query(`SELECT * FROM users WHERE username='${username}'`)
        if (existUser.length > 0) {
            return res.json({ message: "username alredy exist" })
        }
        let result = await sqlConnection.query(`UPDATE users SET username='${username}', password='${password}', name='${name}', age='${age}', email='${email}', isAdmin=${isAdmin}  WHERE id=${id}`)
        res.json({ status: "success" })
    }
    catch (err) {
        console.log(err);
        res.json({ status: "failed" })
    }
    res.end()
})

module.exports = router