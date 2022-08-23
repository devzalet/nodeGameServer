var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql   =     require("mysql"); //agregado

// Conectando a mysql
// var conexion    =    mysql.createPool({
//     connectionLimit   :   100,
//     host              :   'localhost',
//     user              :   'root',
//     password          :   '',
//     database          :   'nerachat',
//     debug             :   false
// });

var conexion    =    mysql.createPool({
    connectionLimit   :   100,
    host              :   'ku1p1sq5j8u6.eu-west-2.psdb.cloud',
    user              :   'lioru1uxhmjj',
    password          :   'pscale_pw_T_XnGKFGhHI3va9bEfMB9UX2swBcGTrfgMS4AYeJeKo',
    database          :   'nerachatsql',
    debug             :   false,
	ssl: {
        rejectUnauthorized: false
    }
});


//server.listen(3000);
server.listen(process.env.PORT || 5000);

// global variables for the server
var enemies = [];
var playerSpawnPoints = [];
var clients = [];

app.get('/', function(req, res) {
	//res.send('levantando chat para neraverse "/"');
	res.sendFile(__dirname + '/index.html'); //Ruta para lanzar el index
});


io.on('connection',function(socket){  
    socket.on('nuevo',function(status){
      addComentario(status,function(res){
        if(res){
            io.emit('refrescar',status);
        } else {
            io.emit('error');
        }
      });
    });
});

var addComentario = function (status,callback) {
    conexion.getConnection(function(err,connection){
        if (err) {
          connection.release();
          callback(false);
          return;
        }
    connection.query("INSERT INTO `mensajes` (`mensaje`,`otromensaje`) VALUES ('"+status+"','"+status+"')", function(err,rows){ //Insertando nuestro comentario
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

// var addComentario = function (data,callback) {
//     conexion.getConnection(function(err,connection){
//         if (err) {
//           connection.release();
//           callback(false);
//           return;
//         }
//     connection.query("INSERT INTO `mensajes` (`mensaje`,`otromensaje`) VALUES ('"+data.name+"','"+data.name2+"')", function(err,rows){ //Insertando nuestro comentario
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

// io.on('connection', function(socket) {
	
// 	var currentPlayer = {};
// 	currentPlayer.name = 'unknown';

// 	socket.on('newmsg',function(data){
// 		console.log(currentPlayer.name+' recv: play: '+JSON.stringify(data));
// 		addComentario(data,function(res){
// 		  if(res){
// 			  io.emit('refrescar',data);
// 		  } else {
// 			  io.emit('error');
// 		  }
// 		});
// 	  });

// 	socket.on('player connect', function() {
// 		console.log(currentPlayer.name+' recv: player connect');
// 		for(var i =0; i<clients.length;i++) {
// 			var playerConnected = {
// 				name:clients[i].name,
// 				position:clients[i].position,
// 				rotation:clients[i].position,
// 				health:clients[i].health
// 			};
// 			// in your current game, we need to tell you about the other players.
// 			socket.emit('other player connected', playerConnected);
// 			console.log(currentPlayer.name+' emit: other player connected: '+JSON.stringify(playerConnected));
// 		}
// 	});

// 	socket.on('play', function(data) {
// 		console.log(currentPlayer.name+' recv: play: '+JSON.stringify(data));
// 		// if this is the first person to join the game init the enemies
// 		if(clients.length === 0) {
// 			numberOfEnemies = data.enemySpawnPoints.length;
// 			enemies = [];
// 			data.enemySpawnPoints.forEach(function(enemySpawnPoint) {
// 				var enemy = {
// 					name: guid(),
// 					position: enemySpawnPoint.position,
// 					rotation: enemySpawnPoint.rotation,
// 					health: 100
// 				};
// 				enemies.push(enemy);
// 			});
// 			playerSpawnPoints = [];
// 			data.playerSpawnPoints.forEach(function(_playerSpawnPoint) {
// 				var playerSpawnPoint = {
// 					position: _playerSpawnPoint.position,
// 					rotation: _playerSpawnPoint.rotation
// 				};
// 				playerSpawnPoints.push(playerSpawnPoint);
// 			});
// 		}

// 		var enemiesResponse = {
// 			enemies: enemies
// 		};
// 		// we always will send the enemies when the player joins
// 		console.log(currentPlayer.name+' emit: enemies: '+JSON.stringify(enemiesResponse));
// 		socket.emit('enemies', enemiesResponse);
// 		var randomSpawnPoint = playerSpawnPoints[Math.floor(Math.random() * playerSpawnPoints.length)];
// 		currentPlayer = {
// 			name:data.name,
// 			position: randomSpawnPoint.position,
// 			rotation: randomSpawnPoint.rotation,
// 			health: 100
// 		};
// 		clients.push(currentPlayer);
// 		// in your current game, tell you that you have joined
// 		console.log(currentPlayer.name+' emit: play: '+JSON.stringify(currentPlayer));
// 		socket.emit('play', currentPlayer);
// 		// in your current game, we need to tell the other players about you.
// 		socket.broadcast.emit('other player connected', currentPlayer);
// 	});

// 	socket.on('player move', function(data) {
// 		console.log('recv: move: '+JSON.stringify(data));
// 		currentPlayer.position = data.position;
// 		socket.broadcast.emit('player move', currentPlayer);
// 	});

// 	socket.on('player turn', function(data) {
// 		console.log('recv: turn: '+JSON.stringify(data));
// 		currentPlayer.rotation = data.rotation;
// 		socket.broadcast.emit('player turn', currentPlayer);
// 	});

// 	socket.on('player shoot', function() {
// 		console.log(currentPlayer.name+' recv: shoot');
// 		var data = {
// 			name: currentPlayer.name
// 		};
// 		console.log(currentPlayer.name+' bcst: shoot: '+JSON.stringify(data));
// 		socket.emit('player shoot', data);
// 		socket.broadcast.emit('player shoot', data);
// 	});

// 	socket.on('health', function(data) {
// 		console.log(currentPlayer.name+' recv: health: '+JSON.stringify(data));
// 		// only change the health once, we can do this by checking the originating player
// 		if(data.from === currentPlayer.name) {
// 			var indexDamaged = 0;
// 			if(!data.isEnemy) {
// 				clients = clients.map(function(client, index) {
// 					if(client.name === data.name) {
// 						indexDamaged = index;
// 						client.health -= data.healthChange;
// 					}
// 					return client;
// 				});
// 			} else {
// 				enemies = enemies.map(function(enemy, index) {
// 					if(enemy.name === data.name) {
// 						indexDamaged = index;
// 						enemy.health -= data.healthChange;
// 					}
// 					return enemy;
// 				});
// 			}

// 			var response = {
// 				name: (!data.isEnemy) ? clients[indexDamaged].name : enemies[indexDamaged].name,
// 				health: (!data.isEnemy) ? clients[indexDamaged].health : enemies[indexDamaged].health
// 			};
// 			console.log(currentPlayer.name+' bcst: health: '+JSON.stringify(response));
// 			socket.emit('health', response);
// 			socket.broadcast.emit('health', response);
// 		}
// 	});

// 	socket.on('disconnect', function() {
// 		console.log(currentPlayer.name+' recv: disconnect '+currentPlayer.name);
// 		socket.broadcast.emit('other player disconnected', currentPlayer);
// 		console.log(currentPlayer.name+' bcst: other player disconnected '+JSON.stringify(currentPlayer));
// 		for(var i=0; i<clients.length; i++) {
// 			if(clients[i].name === currentPlayer.name) {
// 				clients.splice(i,1);
// 			}
// 		}
// 	});

// });

console.log('--- server is running ...');

function guid() {
	function s4() {
		return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}