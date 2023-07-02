// ブックマークのURLをリスト形式で表示する関数
function displayURLs(urlContent) {
  const list = document.getElementById('bookmarkList');

  for (let key in urlContent) {
    const urls = urlContent[key];

    const headItem = document.createElement('li');
    headItem.textContent = `URLの頭: ${key}`;
    list.appendChild(headItem);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      const listItem = document.createElement('li');
      listItem.textContent = `ページ名: ${url.title}, URL: ${url.url}`;
      list.appendChild(listItem);
    }
  }
}

// コンテンツスクリプトにメッセージを送信して情報を取得する
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getBookmarks' }, function (response) {
    if (response && response.bookmarks) {
      displayURLs(response.bookmarks);
    }
  });
});
