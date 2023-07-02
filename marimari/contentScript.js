// メッセージを受信してブックマーク情報を返す
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getBookmarks') {
      chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        const rootBookmarkNode = bookmarkTreeNodes[0];
        let urlContent = {};
  
        function handleUrlhead(url) {
          const url_tmp = new URL(url);
          return url_tmp.hostname;
        }
  
        function storageArray(url_key, bookmark) {
          if (urlContent[url_key]) {
            urlContent[url_key].push(bookmark);
          } else {
            urlContent[url_key] = [bookmark];
          }
        }
  
        function processBookmarks(bookmarkNode) {
          if (bookmarkNode.children) {
            bookmarkNode.children.forEach(function (childNode) {
              processBookmarks(childNode);
            });
          } else {
            const url = bookmarkNode.url;
            const url_key = handleUrlhead(url);
            storageArray(url_key, bookmarkNode);
          }
        }
  
        processBookmarks(rootBookmarkNode);
  
        sendResponse({ bookmarks: urlContent });
      });
  
      return true; // メッセージの非同期処理が完了するまでレスポンスを保持
    }
  });
  