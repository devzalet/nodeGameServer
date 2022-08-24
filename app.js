var app = require('express')();
var http = require('http').Server(app);
var mysql   =     require("mysql");
var io = require('socket.io')(http);

const conexion = mysql.createPool({
        database: "heroku_700a51ffd0a558a",
        user: "bfc2dbf35bd86e",
        host: "eu-cdbr-west-03.cleardb.net",
        password: "527862e8",
            ssl: {
        rejectUnauthorized: false
    }
    });
    //conexion.query('insert into mensajes values("otro","newmesaje")');
    console.log('se conecto correctamente a la bd en el puerto: '+ process.env.PORT);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var userId = 0;

io.on('connection', function(socket) {
	
    socket.userId = userId ++;
    
    socket.on('chat', function(msg){
    console.log('message from user#' + socket.userId + ": " + JSON.stringify(msg));
    //conexion.query("INSERT INTO `mensajes` (`mensaje`,`otromensaje`) VALUES ('"+socket.userId+"','"+msg.name2+"')")

    socket.emit('chat', msg);

    io.emit('chat', {
      id: socket.userId,
      msg: msg.name2
    });
  });
  
  socket.on('login', function(logdata){
    console.log("message from user "+ JSON.stringify(logdata));
    conexion.query("SELECT * FROM `Playernv` WHERE `playfabId`='"+logdata.playfabId+"'" , function(err, result, fields) {
        if (err){
            //socket.emit('login',logdata.playfabId);
            // io.emit('chat', {
            //     id: "userId",
            //     msg: logdata.playfabId
            //   });
            console.log(err);
            throw err;  
        } else{
            console.log(result[0].displayName);
        }
      });
  });

});

http.listen(process.env.PORT || 5000);
//http.listen(4000);