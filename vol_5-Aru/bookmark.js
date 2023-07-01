console.log("hello");
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

        //   let myDict = {
        //   }

        //   if(myDict[url_key]){
        //     myDict[url_key].push(url);
        //   }else{
        //     myDict[url_key]=[url]
        //   }

        storageArray(url_key, bookmarkNode);
        for (let key in sameUrlContent) {
            const keys = Object.keys(sameUrlContent);
            console.log(`URLの頭: ${key}`);
            let url_head = sameUrlContent[key];
            for (let i = 0; i < url_head.length; i++) {
                console.log('ページ名:', url_head[i].title);
                console.log('URL:', url_head[i].url);
              }
            
          }
          //console.log(Object.keys(myDict))
          
        }
      }
    
      // ルートフォルダ内のブックマークを取得する
      getBookmarks(rootBookmarkNode);
    });
})