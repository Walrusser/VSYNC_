/**
 * Created by Alexander Fehr on 2018-02-04.
 */

function onClickCreate() {
    window.location.replace("player.html" + "?" + Math.floor((Math.random() * 100000) + 1));
}