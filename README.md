説明
----

posfie-cutter をローカルでテストするための試作
Firefox Developerの137.0b6-9あたりだとローカルのhtmlからlocalstrageへ保存ができないため動作しない

この中身をこのままposfie-cutterへ移してもスクリプト起動時には $("#comment-box-portal.comment_box")　の中身がまだ無いため削除ボタンをつけることができずに終わってしまう

テスト用なのでローカルにコピーしてブラウザでtest.htmlを開くと [x] で削除してコメント非表示、[削除済] で削除の取り消しとコメントの表示を試すことができる