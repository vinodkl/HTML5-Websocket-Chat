var host = "ws://127.0.0.1:8082/chat/websocket/server.php";
var myWebSocket = new WebSocket(host);

(function(){
       myWebSocket.onopen = function(evt) { 

       };
       myWebSocket.onmessage = function(msg){ 
               var dt = msg.data;
               if(dt[0] != "{") {
                       dt = dt.substr(1,dt.length-1);
               }
               
               var nick = document.getElementById('your_nick').value;
               var data = eval('(' + dt + ')');
               if(data.action == "join") {
                       var user_list = document.getElementById('user-list');
                       user_list.innerHTML = '';
                       var new_user;
                       for(var user in data.users) {
                               var li = document.createElement('li');
                               li.innerHTML = user;
                               new_user = user;
                               user_list.appendChild(li);
                       
                               if(nick == user) {
                                       li.setAttribute("class","current-user");
                               }
                       }
                       var time = data.users[new_user].time;
                       var irc_logs = document.getElementById('irc-logs');
                       var li = document.createElement('li');
                       var log_msg = '['+time+'] '+new_user+' joined the room';
                       li.innerHTML = log_msg;
                       li.setAttribute("class","announce");
               
                       irc_logs.appendChild(li);
               } else if(data.action == "msg") {
                       var irc_logs = document.getElementById('irc-logs');
                       var li = document.createElement('li');
                       li.innerHTML = '['+data.time+'] <b>'+data.nick+'</b>: '+data.msg;
                       irc_logs.appendChild(li);
               }
       };
	myWebSocket.onclose = function(msg){
		var irc_logs = document.getElementById('irc-logs');
		var li = document.createElement('li');
        var log_msg = '['+time+'] left the room';
        li.innerHTML = log_msg;
        li.setAttribute("class","announce");
	}
})();

doClick = function(e) {
      var nick = document.getElementById('your_nick').value;
      document.getElementById('login-box').style.display='none';
      document.getElementById('irc-chat').style.display='';
      myWebSocket.send('join::-'+nick);                      
}

sendMsg = function(){
        var nick = document.getElementById('your_nick').value;
        var user_msg = document.getElementById('user_msg').value;
        myWebSocket.send('msg::-'+nick+'-::'+user_msg);
        document.getElementById('user_msg').value = "";
}
