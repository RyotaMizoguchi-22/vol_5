//"Search"(htmlファイル内id)の中身が変更された時(EnterKeyが押された時)に動作。

$('#search').change(function () {
    //"bookmark"(htmlファイル内id)の子要素を削除する。
    $('#bookmarks').empty();
    //dumpBookmarks関数で"Search"で指定された値を表示。
    dumpBookmarks($('#search').val());
    console.log('search_val:',$('#search').val());
});

function dumpBookmarks(query) {
    //BookMarkを全て取得
    const bookmarkTreeNodes = chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      //"bookmarks"(htmlファイル内id)内の末尾にHTMLを追加する。
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}

function dumpTreeNodes(bookmarkNodes, query) {
    const list = $('<ul>');
    //bookmarksNodes.length = Bookmarkに保存されている個数
    for (let i = 0; i < bookmarkNodes.length; i++) {
      //li要素として追加される。
      console.log('dumpNode',dumpNode(bookmarkNodes[i], query));
      list.append(dumpNode(bookmarkNodes[i], query));
    }
    return list;
}

function dumpNode(bookmarkNode, query) {
    let span = '';
    //タイトルが存在する時
    if (bookmarkNode.title) {
      console.log('bookmarkNode.childeren',bookmarkNode.children);
      console.log('bookmarkNode.childeren_not',!bookmarkNode.children);
      //query(検索条件)かつ子ノードでない時
      if (query && !bookmarkNode.children) {
        //文字列変換(大文字->小文字変換)したbookmarkのタイトル文字列内に検索文字列が含まれていなかったら
        if (String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) ==-1) {
          //空白？
          return $('<span></span>');
        }
      }
      const anchor = $('<a>');
      //<a href='飛ぶURL'> の設定
      anchor.attr('href', bookmarkNode.url);
      //textの設定
      anchor.text(bookmarkNode.title);

      //anchorをクリックしたときに動作
      anchor.click(function () {
        //urlを新しいタブで開く
        chrome.tabs.create({ url: bookmarkNode.url });
      });

      span = $('<span>');
      span
        .append(anchor);
    }

    const li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
    console.log('bookmarkNode.title',bookmarkNode.title);

    //子ノードかつ中身が1つ以上の時
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        li.append(dumpTreeNodes(bookmarkNode.children, query));
    }

    return li;
}

//webページの読み込み完了時に動作
document.addEventListener('DOMContentLoaded', function () {
    dumpBookmarks();
  });
