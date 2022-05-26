const mysql = require('mysql2')
let connection = null;

connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "123456789",
    database: 'enigma_test'
});

connection.connect(async () => {
    console.log("DB connected");
})



module.exports = {
    query: async (query) => { // todo: sanitize
        const result = await connection.promise().query(query)
        return result[0]

    }
}