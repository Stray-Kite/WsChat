var stompClient = null;
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
        $("#chat").show();
    }
    else {
        $("#conversation").hide();
        $("#chat").hide();
    }
    $("#greetings").html("");
}
function connect() {
    if (!$("#name").val()) {
        return;
    }
    // registry.addEndpoint("/chat").withSockJS()中的那个"/chat"
    var socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        // 第一个参数就是目的地地址
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body));
        });
    });
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
}
function sendName() {
    // 发送，第一个参数就是GreetingController中的发送源地址
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val(),'content':$("#content").val()}));
}
function showGreeting(message) {
    $("#greetings").append("<div>" + message.name+":"+message.content + "</div>");
}

$(function () {
    //分别是点击连接、断开连接、发送三个事件，以及对应出发的函数
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});
