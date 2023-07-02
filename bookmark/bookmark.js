let sameUrlContent = {};

$('#search').change(function () {
  $('#bookmarks').empty();
  sameUrlContent = {};
  dumpBookmarks($('#search').val());
  console.log('search_val:', $('#search').val());
});

function dumpBookmarks(query) {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    dumpTreeNodes(bookmarkTreeNodes, query);
    renderSameUrlContent();
  });
}

function dumpTreeNodes(bookmarkNodes, query) {
  for (let i = 0; i < bookmarkNodes.length; i++) {
    dumpNode(bookmarkNodes[i], query);
  }
}

function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (bookmarkNode.children) {
      dumpTreeNodes(bookmarkNode.children, query);
    } else if (bookmarkNode.url) {
      if (!query || bookmarkNode.title.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        const url_key = handleUrlhead(bookmarkNode.url);
        storageArray(url_key, bookmarkNode);
      }
    }
  }
}

function handleUrlhead(url) {
  const url_tmp = new URL(url);
  return url_tmp.hostname;
}

function storageArray(url_key, bookmarkNode) {
  if (sameUrlContent[url_key]) {
    sameUrlContent[url_key].push(bookmarkNode);
  } else {
    sameUrlContent[url_key] = [bookmarkNode];
  }
}

function renderSameUrlContent() {
  for (let url_key in sameUrlContent) {
    const list = $('<ul>');
    sameUrlContent[url_key].forEach(function(bookmarkNode) {
      const anchor = $('<a>');
      anchor.attr('href', bookmarkNode.url);
      anchor.text(bookmarkNode.title);
      anchor.click(function () {
        chrome.tabs.create({ url: bookmarkNode.url });
      });
      const span = $('<span>');
      span.append(anchor);
      const li = $('<li>').append(span);
      list.append(li);
    });
    $('#bookmarks').append($('<h2>').text(url_key), list);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
