console.log(`hello`);
chrome.action.onClicked.addListener((tab) => {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      // ブックマークツリーのルートノードを取得
      const rootBookmarkNode = bookmarkTreeNodes[0];
      let sameUrlContent = {};

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
          let url_key = handleUrlhead(bookmarkNode.url);
          console.log('URLの頭:', url_key);
          storageArray(url_key, bookmarkNode.url);
          for (let key in sameUrlContent) {
            console.log(`Key: ${key}, Value: ${sameUrlContent[key]}`);
          }
          console.log('------------------');
        }
      }
    
      // ルートフォルダ内のブックマークを取得する
      getBookmarks(rootBookmarkNode);
    });
})