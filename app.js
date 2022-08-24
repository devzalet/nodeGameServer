var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql   =     require("mysql"); //agregado

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

main();
async function main(){
    const conexion = mysql.createPool({
        //connectionLimit   :   200,
        database: "nerachatsql",
        user: "5107gyg8ioyw",
        host: "ku1p1sq5j8u6.eu-west-2.psdb.cloud",
        password: "pscale_pw_BtTO4xV33109V_DntPVi05q_-YMCBhHs-0iKn38fRqA",
    // debug             :   false,
    ssl: {
        rejectUnauthorized: false
    }
    });
    conexion.query('insert into mensajes values("otro","mensaje89101112")');
    //console.log('se conecto correctamente a la bd');
}


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var userId = 0;
io.on('connection', function(socket){
  socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);

  socket.on('chat', function(msg){
    console.log('message from user#' + socket.userId + ": " + msg);
    io.emit('chat', {
      id: socket.userId,
      msg: msg
    });
  });
});


http.listen(process.env.PORT || 5000);
//http.listen(4000);