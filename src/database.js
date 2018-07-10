const mysql = require('mysql');

var db = {
    host:"localhost",
    user: 'root',
    password: '123456',
    database: 'CMCore',
    table: "files",
    tableColum: "ThumbUrl"
};

var updateThumbInDb = (file, thumbUrl) => {
    // Create conection
    var connection = mysql.createConnection({
        host     : db.host,
        user     : db.user,
        password : db.password,
        database : db.database
    });
    // Create Query
    var query = `UPDATE ${db.database}.${db.table} SET ${db.tableColum} = "${thumbUrl}" WHERE (PathName = "${file.name}${file.ext}" AND Id <> 0)`;
   // Conect to DB
    connection.connect();
    // Run Query
    connection.query(query, (error, results, fields) => {
        if (error){
            console.log(error);
            return false;
        }
        console.log('The solution is: ', results[0].solution);
    });
    return true;
}

module.exports = {
    updateThumbInDb
}