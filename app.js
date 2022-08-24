var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql   =     require("mysql"); //agregado

//main();
//async function main(){
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
    //conexion.query('insert into mensajes values("otro","mensaje89101112")');
    //console.log('se conecto correctamente a la bd');
//}


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var userId = 0;
// io.on('connection', function(socket){
//   socket.userId = userId ++;
//   console.log('a user connected, user id: ' + socket.userId);

//   socket.on('chat', function(msg){
//     console.log('message from user#' + socket.userId + ": " + msg);
//     io.emit('chat', {
//       id: socket.userId,
//       msg: msg
//     });
//   });
// });

//ADDED
io.on('connection', function(socket) {
	
    socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);

  socket.on('chat', function(msg){
    console.log('message from user#' + socket.userId + ": " + msg);
    io.emit('chat', {
      id: socket.userId,
      msg: msg
    });
  });
	// var currentPlayer = {};
	// currentPlayer.name = 'unknown';

	socket.on('newmsg',function(data){
		console.log(currentPlayer.name+' recv: play: '+JSON.stringify(data));
		addComentario(data,function(res){
		  if(res){
			  io.emit('refrescar',data);
		  } else {
			  io.emit('error');
		  }
		});
    });
});
var addComentario = function (data,callback) {
    conexion.getConnection(function(err,connection){
        if (err) {
          connection.release();
          callback(false);
          return;
        }
    connection.query("INSERT INTO `mensajes` (`mensaje`,`otromensaje`) VALUES ('"+data.name+"','"+data.name2+"')", function(err,rows){ //Insertando nuestro comentario
            connection.release();
            if(!err) {
              callback(true);
            }
        });
     connection.on('error', function(err) {
              callback(false);
              return;
        });
    });
}

//ADEED

http.listen(process.env.PORT || 5000);
//http.listen(4000);