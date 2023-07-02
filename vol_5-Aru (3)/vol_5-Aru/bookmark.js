console.log("hello");
var myArray = ["データ1", "データ2", "データ3"];

$(document).ready(function() {
    var dataList = $("#data-list");
  
    for (var i = 0; i < myArray.length; i++) {
      var listItem = $("<li>").text(myArray[i]);
      dataList.append(listItem);
    }
  });
chrome.action.onClicked.addListener((tab) => {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      // ブックマークツリーのルートノードを取得
      const rootBookmarkNode = bookmarkTreeNodes[0];
      let sameUrlContent = {};

      //url
      function handleUrlhead(url) {
        let url_tmp = new URL(url);
        return url_tmp.hostname
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
})