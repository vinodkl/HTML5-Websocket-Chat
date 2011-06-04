#!/php -q
<?php  /*  >php -q server.php  */

error_reporting(E_ALL);
set_time_limit(0);
ob_implicit_flush();

function process($user, $msg, $server){
	list($action,$message) = explode('::-',$msg);
	
    $time = date('H:i');
    $return = array();
	$return['action'] = $action;
	
	if($action == "join") {
		$user->data['nick'] = $message;
    	foreach($server->getUsers() as $user){
        	if (! isset($user->data['color'])) {
            	$user->data['ip'] = $user->ip;        
        	}
			$user->data['time'] = $time;
			$user->data['action'] = $action;
        	$return['users'][$user->data['nick']] = $user->data;
    	}
	} else if($action == "msg") {
		list($nick, $msg) = explode('-::',$message);
		$return['msg'] = $msg;
		$return['nick'] = $nick;
		$return['time'] = $time;
	}
	
	// send the data to all current users
	foreach($server->getUsers() as $user){
    	$server->send($user->socket, json_encode($return));
	}
}

require_once './pear/WebSocketServer.php';
$webSocket = new WebSocketServer("127.0.0.1", 8082, 'process');
$webSocket->run();
