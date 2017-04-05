/* global chrome, $0 */
const getView = function () {
  return $0 && $0.__redom_view;
};

const init = function () {
  const view = window.$r = $0 && $0.__redom_view;

  return view && view.constructor.name;
};

const findFirstViews = function () {
  return iterate($0, []);

  function iterate (node, results) {
    let traverse = node.firstChild;

    while (traverse) {
      if (traverse.__redom_view) {
        results.push(traverse);
      } else {
        iterate(traverse, results);
      }
      traverse = traverse.nextSibling;
    }

    return results;
  }
};

chrome.devtools.panels.create('RE:DOM', 'icon48.png', 'doc.html');

chrome.devtools.panels.elements.createSidebarPane('RE:DOM', function (sidebar) {
  const updateElementProperties = () => {
    chrome.devtools.inspectedWindow.eval(`(${init.toString()})()`, function (result) {
      if (result) {
        sidebar.setExpression(`(${getView.toString()})()`, 'View: ' + result);
      } else {
        sidebar.setExpression(`(${findFirstViews.toString()})()`, 'Child views');
      }
    });
  };
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
});
