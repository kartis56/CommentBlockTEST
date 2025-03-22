// ==UserScript==
// @name        test-each
// @namespace   kartis56
// @description posfieの特定ユーザを見えなくする
// @match     \GitHub\CommentBlockTEST
// ローカルなので、URLは適当に変えてください
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     9
// @grant       none
// ==/UserScript==

(function() {
    jQuery.noConflict();
    var $ = jQuery;


    var urlToIdPattern = /\/(?:default_)?profile_images\/([^\/]+)/;

    function urlToId(url) {
        if(url.match(urlToIdPattern)) {
            return RegExp.$1;
        } else {
            return null;
        }
    }

    function getCookieMap() {
        var ret = new Array();

        var allCookies = document.cookie;
        if( allCookies != '' ) {
            var cookies = allCookies.split('; ');
            for (var i = 0; i < cookies.length; i++ ) {
                var cookie = cookies[i].split('=');

                // クッキーの名前をキーとして 配列に追加する
                ret[cookie[0]] = decodeURIComponent(cookie[1]);
            }
        }

        return ret;
    }

    function getHiddenUserIds() {
        var joinedHiddenUserIds = null;
        if (typeof localStorage !== 'undefined') {
            // localStorageから取得
            joinedHiddenUserIds = localStorage.getItem('posfie-cutter.hiddenCommentUserIds');
        }
        if (!joinedHiddenUserIds) {
            // Cookieから取得
            var cookieMap = getCookieMap();
            joinedHiddenUserIds = cookieMap['hiddenCommentUserIds'];
        }
        if (joinedHiddenUserIds) {
            return joinedHiddenUserIds.split(' ');
        } else {
            return new Array();
        }
    }

    function setHiddenUserIds(ids) {
        if (typeof localStorage !== 'undefined') {
            // localStorageに保存
            localStorage.setItem('posfie-cutter.hiddenCommentUserIds', ids.join(' '));
        } else {
            // Cookieに保存
            var now = new Date();
            var maxAgeDay = 30;
            now.setTime(now.getTime() + maxAgeDay * 24 * 60 * 60 * 1000);
            var expires = now.toGMTString();
            var cookie = 'hiddenCommentUserIds=' + encodeURIComponent(ids.join(' ')) + ";expires=" + expires;

            if (cookie.length > 4096) {
                return false;
            }

            document.cookie = cookie;
        }
	    hideComments();
	    return true;
    }

    function addHiddenUserId(id) {
        var ids = getHiddenUserIds();
        if ($.inArray(id, ids) == -1) {
            ids.push(id);
        }

        if (!setHiddenUserIds(ids)) {
            var deleted = 0;
            while (ids.length > 0) {
                ids.shift();
                deleted++;
                if (setHiddenUserIds(ids)) {
                    alert("容量オーバーのため古いIDを" + deleted + "件削除しました。");
                    return;
                }
            }
        }
    }

    function removeHiddenUserId(id) {
        var ids = getHiddenUserIds();
        var newIds = [];
console.log("joinedID was remove",ids);
        for (var i = 0; i < ids.length; i++) {
            if (id != ids[i]) {
                newIds.push(ids[i]);
            }
        }
        setHiddenUserIds(newIds);
    }


   function hideComments() {
//           observer.disconnect();

        var hiddenUserIds = getHiddenUserIds();
console.log("hiddenID",hiddenUserIds);
        var listItem =$('#comment-box-portal.comment_box')
        var idLink = listItem.find("img");
        $( idLink ).each(function(index){
console.log("THIS at hide ",$(this));
            var id = urlToId( $(this).attr('src') );
            if (id == null || id == '') {
                console.error("id is null at hideUsers",id);
                //UIが変わって urlToId が動かないときこのエラーがでてほしい
            }
            
console.log("idLink",idLink[index]);
            var NameLink = $(this).parents().find(".screen-name");
            var txName = NameLink[index].innerText.replace(/@\w*/, "");
console.log("NameLink",NameLink);
console.log("Name",txName);

            var ixSakujo=$(this).parents().find(".Sakujo");
            var ixComment=$(this).parents().find(".comment");
            var ixRemoved=$(this).parents().find(".removed");

            if (ixRemoved[index].length == 0 ) {
console.log("削除済み追加",$(this).parents().find(".removed"));
                $("<div>  [削除済] </div>")
                    .addClass("removed")
                    .css({"cursor": "pointer"})
                    .attr("title", txName)
                    .dblclick(function() {
                        if (confirm("このユーザを見えるようにしますか？")) {
                            removeHiddenUserId(id);
                        }
                    })
            	.insertAfter(NameLink[index]);
            }
            if ($.inArray(id, hiddenUserIds) != -1) {
console.log("inArray" );
console.log("SPAN    ",ixSakujo[index]);
console.log("COMMENT    ",ixComment[index]);
console.log("REMOVED    ",ixRemoved[index]);
                ixSakujo[index].hidden=true;
                ixComment[index].hidden=true;
                ixRemoved[index].hidden=false;
            } else {
console.log("NOT inArray");
console.log("SPAN    ",ixSakujo[index]);
console.log("COMMENT    ",ixComment[index]);
console.log("REMOVED    ",ixRemoved[index]);
                ixSakujo[index].hidden=false;
                ixComment[index].hidden=false;
                ixRemoved[index].hidden=true;
            }
        });
   // observer.observe("#comment-box-portal", { childList: true, subtree: true });

    }
        // DOMの変更を監視
    const observer = new MutationObserver(hideComments);
    const targetNode =document.getElementById("#comment-box-portal");

    $(function() {
	    
//        var Commentbox = document.getElementById("comment-box-portal");
//        var ulist = Commentbox.getElementsByTagName("ul");
//        $.each(ulist,function(){

        var listItem =$('#comment-box-portal.comment_box');
console.log("sensei1");
        var idLink = listItem.find("img");
//console.log("idLink",idLink);

        $(idLink).each(function(index){
//        for( let i=0;i<$(idLink).length;i++ ){
//            var id = urlToId( $(this).find("img").attr('src'));
//console.log("THIS",$(this[index]).attr('src'));

//console.log("THIS INDEX ",index);
//console.log("THIS",$(idLink)[index]);


            var id = urlToId( $(this).attr('src') );
//console.log("id",id);
            
            var NameLink = $(this).parents().find(".screen-name");
//console.log("NameLink\r\nkkkk\r\n",NameLink[index]);
            var txName = NameLink[index].innerText.replace(/@\w*/, "");
//console.log("Name",txName);
            if (id == null || id == '') {
                console.error("id is null at hideUsers",id);
                //UIが変わって urlToId が動かないときこのエラーがでてほしい
            }
//            var idLink = listItem.find(".screen-name");
//            var id = idLink.text().replace(/@\w*/, "");
            $("<span>  [×]</span>")
                .addClass("Sakujo")
                .css({"cursor": "pointer"})
                .attr("title", "このユーザのコメントを見えなくする")
                .click(function() {
                    if (confirm("このユーザを見えなくしますか？")) {
                        addHiddenUserId(id);
console.log("                  HIDE ID                ",id);
                    }
	                    hideComments();
                        return false;
                })
                .insertAfter(NameLink[index]);
                $("<div>  [削除済] </div>")
                    .addClass("removed")
                    .css({"cursor": "pointer"})
                    .css({"hidden": "true"})
                    .attr("title", txName)
                    .dblclick(function() {
                        if (confirm("このユーザを見えるようにしますか？")) {
                            removeHiddenUserId(id);
                        }
                    }
                )
            	.insertAfter(NameLink[index]);
        });
        hideComments();
	  //  observer.observe("#comment-box-portal", { childList: true, subtree: true });


    })


})();

 