import mysql from 'mysql';
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', //linux mint kurulumundan sonra şifre eklendi
    database: 'auth'
})

export {
    connection
}