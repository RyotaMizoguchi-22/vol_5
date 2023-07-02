//"Search"(htmlファイル内id)の中身が変更された時(EnterKeyが押された時)に動作。

console.log("hello");
var myArray = ["データ1", "データ2", "データ3"];

$('#search').change(function () {
    //"bookmark"(htmlファイル内id)の子要素を削除する。
    $('#bookmarks').empty();
    //dumpBookmarks関数で"Search"で指定された値を表示。
    dumpBookmarks($('#search').val());
    console.log('search_val:',$('#search').val()); 
});



$(document).ready(function() {
    var dataList = $("#data-list");
  
    for (var i = 0; i < myArray.length; i++) {
      var listItem = $("<li>").text(myArray[i]);
      dataList.append(listItem);
    }
  });



function dumpBookmarks(dic,query) {
    //BookMarkを全て取得
      //"bookmarks"(htmlファイル内id)内の末尾にHTMLを追加する。
      $('#bookmarks').append(dumpTreeNodes(dic, query));
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
      if (query) {
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
      span.append(anchor);
    }

    const li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
    console.log('bookmarkNode.title',bookmarkNode.title);

    //子ノードかつ中身が1つ以上の時
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        li.append(dumpTreeNodes(bookmarkNode.children, query));
    }

    return li;
}

function mybookmark(){
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    // ブックマークツリーのルートノードを取得
    const rootBookmarkNode = bookmarkTreeNodes[0];
    let sameUrlContent = {};

    //url
    function handleUrlhead(url) {
      let url_tmp = new URL(url);
      return url_tmp.hostname;
    }

    function storageArray(url_key, url){

      let key = url_key;  // 追加したいキー

      // キーが存在すればその配列に値を追加、存在しなければ新たに配列を作成
      if (sameUrlContent[key]) {
        sameUrlContent[key].push(url);
      } else {
        sameUrlContent[key] = [url];
      }

    }

    chrome.runtime.getBackgroundPage(function(backgroundPage) {
      var myArray = backgroundPage.myArray;
    
      var dataList = document.getElementById("data-list");
    
      for (var i = 0; i < myArray.length; i++) {
        var listItem = document.createElement("li");
        listItem.textContent = myArray[i];
        dataList.appendChild(listItem);
      }
    });
  
    // ルートフォルダ内のブックマークを取得する関数
    function getBookmarks(bookmarkNode) {
      // ブックマークノードがフォルダである場合
      if (bookmarkNode.children) {
        // サブフォルダのブックマークを再帰的に取得
        for (const childNode of bookmarkNode.children) {
          getBookmarks(childNode);
        }
      } else {
        // ブックマークノードがブックマークの場合
        let url = bookmarkNode.url
        console.log('ブックマーク名:', bookmarkNode.title);
        console.log('URL:', url);
        console.log('親フォルダID:', bookmarkNode.parentId);
        console.log('------------------');
      
        let url_key = handleUrlhead(bookmarkNode.url);
        console.log('URLの頭:', url_key);
        console.log('------------------');

      storageArray(url_key, bookmarkNode);
      for (let key in sameUrlContent) {
          console.log(`Key: ${key}, Value: ${sameUrlContent[key]}`);
          let node = sameUrlContent[key];
          for (let i = 0; i < node.length; i++) {
              console.log('ページ名:', node[i].title);
              console.log('URL:', node[i].url);
            }
        }
      }
    }
  
    // ルートフォルダ内のブックマークを取得する
    getBookmarks(rootBookmarkNode);
  });
}

//webページの読み込み完了時に動作
document.addEventListener('DOMContentLoaded', function () {
  let sameUrlContent = {};
  mybookmark;
  $('#bookmarks').append("<ul>");
  $('#bookmarks').append("<li>test</li>");
  for(let key in sameUrlContent){
    $('#bookmarks').append("<li>");
    $('#bookmarks').append(key);
    dumpBookmarks(sameUrlContent[key]);
    $('#bookmarks').append("</li>");
  }
  $('#bookmarks').append("</ul>");
  });
