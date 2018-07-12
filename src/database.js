const mysql = require('mysql');

var db = {
    host:"local",
    user: 'user',
    password: 'pass',
    database: 'data',
    port: 15001,
    table: "Files",
    tableColum: "ThumbUrl"
}
// Create conection
var connection = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    port: db.port,
});

var updateThumbInDb = (file, callback) => {
    // thumb Url 
    var thumbUrl = `https://s3.amazonaws.com/${file.bucket}/${file.fullName}`;
    // Create Query
    var query = `UPDATE ${db.database}.${db.table} SET ${db.tableColum} = "${thumbUrl}" WHERE (PathName = "${file.name}${file.ext}" AND Id <> 0)`;
   // Conect to DB
    connection.connect(function(err) {
        if (err) {
          console.error('Database connection failed: ' + err.stack);
          return;
        }
        console.log('Connected to database.');
    });
    // Run Query
    connection.query(query, (err, rows, fields) => {
        if (err){
            console.log(err);
        }
        console.log('Query run with no problems');
    });
    // End Conection
    connection.end();
    // Send Callback
    callback(null, 'Succes Query');
};

module.exports = {
    updateThumbInDb
}