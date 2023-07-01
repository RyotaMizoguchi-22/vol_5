console.log("hello");
let actionEnabled = true;
chrome.action.onClicked.addListener((tab) => {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      // ブックマークツリーのルートノードを取得
      const rootBookmarkNode = bookmarkTreeNodes[0];
    
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
          console.log('ブックマーク名:', bookmarkNode.title);
          console.log('URL:', bookmarkNode.url);
          console.log('親フォルダID:', bookmarkNode.parentId);
          console.log('------------------');
        }
      }
    
      // ルートフォルダ内のブックマークを取得する
      getBookmarks(rootBookmarkNode);
    });
})