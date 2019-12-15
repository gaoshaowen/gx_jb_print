var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});
 

var loginclient={}
io.on('connection',function(socket) {

  socket.on('login', function (obj) {                //接收数据

    if (! loginclient[obj.devid]){
        
        console.log(obj);

        socket.join( obj.devid)

        loginclient[obj.devid] = socket
        socket.devid = obj.devid

        socket.emit('login_back',{ code:1, msg:'ok', data:obj });  //回发送数据

    }else {

        socket.emit('login_back',{ code:0, msg:'该设备号['+ obj.devid+']已经登记' });  //回发送数据
    }

  });



  socket.on('remoteupload', function (obj) {                //接收转发数据
    console.log('remoteupload:',obj);

    if ( loginclient[obj.devid]){
        loginclient[obj.devid].emit('openremoteupload', obj)

        socket.emit('remoteupload_back',{ code:1, msg:'ok', data:obj });  //回发送数据

    }else {
        socket.emit('remoteupload_back',{ code:0, msg:'fail', data:obj });  //回发送数据
    }

  });


  socket.on('tongbufile', function (obj) {                //同步文件
    console.log('tongbufile:', obj);
    if ( loginclient[obj.devid]){
        loginclient[obj.devid].emit('tongbufile', obj)

        socket.emit('tongbufile_back',{ code:1, msg:'ok', data:obj });  //回发送数据

    }else {
        socket.emit('tongbufile_back',{ code:0, msg:'fail', data:obj });  //回发送数据
    } 
  });





  socket.on('disconnect', function () {
     if ( socket.devid){
       console.log( '设备ID:', socket.devid , ' 断开连接' )
       delete loginclient[socket.devid]
     }

  });

});

 
http.listen(3000, function(){
    console.log('listening on *:3000');
});
