var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var url = window.location.href;
var params = url.split('?');

var xhr = new XMLHttpRequest();

var player;
var eventSource;

if(params[1] != null){
    var roomID = params[1];
} else {
    window.location.replace(window.location.origin + "/?" + Math.floor((Math.random() * 100000) + 1));
} 

var videoID;
var video_id;
var nextKey;
var nextVideoID;
var time;
var status;

var xhttp = new XMLHttpRequest();


document.getElementById("roomID").innerHTML=roomID;
document.title = "VSYNC | " + roomID;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '1080',
        width: '1920',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    //GET THE ID, GET THE TIMESTAMP, SEEK AND PLAY
    makeEventSourceConnection();
}

function makeEventSourceConnection(){
    eventSource = new EventSource("https://vsync.io/player.html/sync/" + roomID + "/");

    eventSource.onmessage = function(event){
        console.log(event.data);
        //CHECK THE DIFFERENCES, INDEX 1 VIDEO_ID, INDEX 2 STATUS, INDEX 3 TIME
        var sync = event.data.split(" ");

        if(sync[0] != videoID){
            player.loadVideoById(sync[0], sync[2], "large");
            player.pauseVideo();
            videoID = sync[0];
            video_id = sync[0];
            //And then set status

            if(sync[1] != status){
                if(sync[1] == 1){

                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }

                    player.playVideo();

                }
                else if(sync[1] == 2){
                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }

                    player.pauseVideo();
                }
                else if(sync[1] == 0){
                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }
                    
                    player.stopVideo();
                }
            }

        } else{
            if(sync[1] != status){
                if(sync[1] == 1){
                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }

                    player.playVideo();
                }
                else if(sync[1] == 2){
                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }

                    player.pauseVideo();
                }
                else if(sync[1] == 0){
                    if(sync[2] - player.getCurrentTime() > 5 || sync[2] - player.getCurrentTime() < 5){
                        player.seekTo(sync[2]);
                    }

                    player.stopVideo();
                }
            }
        }


    };
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING){
        status = 1;
        time = player.getCurrentTime();

        var data = "?video=" + video_id + "&status=" + status + "&time=" + time;
        xhttp.open("POST", "https://vsync.io/player.html/sync/" + roomID + data, true);
        xhttp.send();
    }
    else if (event.data == YT.PlayerState.PAUSED){
        status = 2;
        time = player.getCurrentTime();

        var data = "?video=" + video_id + "&status=" + status + "&time=" + time;
        xhttp.open("POST", "https://vsync.io/player.html/sync/" + roomID + data, true);
        xhttp.send();
    }

    else if (event.data == 0){
        status = 0;
        time = player.getCurrentTime();

        var data = "?video=" + video_id + "&status=" + status + "&time=" + time;
        xhttp.open("POST", "https://vsync.io/player.html/sync/" + roomID + data, true);
        xhttp.send();
    }

}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function onClickPlay() {
    var input = document.getElementById('inputBar').value;

    if (input.indexOf("watch") !== -1 && input.indexOf("youtube") !== -1) {

        video_id = input.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');

        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
    } else {
        video_id = input;
    }


    //PLAY THE VIDEO ID
    
    //?video=sadasd&status=pause&time=0

    status = "2";
    time = 0;

    var data = "?video=" + video_id + "&status=" + status + "&time=" + time;
    xhttp.open("POST", "https://vsync.io/player.html/sync/" + roomID + data, true);
    xhttp.send();

}

function onClickAddToQueue() {
    //ADD TO QUEUE
}

function onClickSkip() {
    //ON CLICK SKIP
}

document.getElementById("inputBar")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {

            var input = document.getElementById('inputBar').value;

            if (input.indexOf("watch") !== -1 && input.indexOf("youtube") !== -1) {

                video_id = input.split('v=')[1];
                var ampersandPosition = video_id.indexOf('&');

                if (ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }
            } else {
                video_id = input;
            }


        }
    });

