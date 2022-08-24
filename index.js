var app = require('express')();
var server = require('http').Server(app);
//var io = require('socket.io')(server);
//var mysql   =     require("mysql"); //agregado
//var mysql   =     require("mysql2"); //modificado

// Conectando a mysql
// var conexion    =    mysql.createPool({
//     connectionLimit   :   100,
//     host              :   'localhost',
//     user              :   'root',
//     password          :   '',
//     database          :   'nerachat',
//     debug             :   false
// });

// var conexion    =    mysql.createPool({
//     connectionLimit   :   100,
// 	database: "nerachatsql",
// 	user: "21zqfflcphu3",
// 	host: "ku1p1sq5j8u6.eu-west-2.psdb.cloud",
// 	password: "pscale_pw_QypBkfdCIvpOzRBEXZxXc4rDv6XPTSPUz8wSDd_g7yc",
// 	debug             :   false,
// 	ssl: {
// 	rejectUnauthorized: false
// }
// });


//server.listen(3000);
server.listen(process.env.PORT || 5000);

// global variables for the server
// var enemies = [];
// var playerSpawnPoints = [];
// var clients = [];

app.get('/', function(req, res) {
	//res.send('levantando chat para neraverse "/"');
	res.sendFile(__dirname + '/index.html'); //Ruta para lanzar el index
});


// io.on('connection',function(socket){  
//     socket.on('nuevo',function(status){
//       addComentario(status,function(res){
//         if(res){
//             io.emit('refrescar',status);
//         } else {
//             io.emit('error');
//         }
//       });
//     });
// });

// var addComentario = function (status,callback) {
//     conexion.getConnection(function(err,connection){
//         if (err) {
//           connection.release();
//           callback(false);
//           return;
//         }
//     connection.query("INSERT INTO `mensajes` (`mensaje`,`otromensaje`) VALUES ('"+status+"','"+status+"')", function(err,rows){ //Insertando nuestro comentario
//             connection.release();
//             if(!err) {
//               callback(true);
//             }
//         });
//      connection.on('error', function(err) {
//               callback(false);
//               return;
//         });
//     });
// }

console.log('--- server is running ...');

function guid() {
	function s4() {
		return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}