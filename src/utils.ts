export const cssLoader = (sUrl, fCallback, id) => {
  if (document.querySelector(`#${id}`)) {
    return;
  }
  const node = window.document.createElement("link");
  node.setAttribute("type", "text/css");
  node.setAttribute("rel", "stylesheet");
  node.setAttribute("href", sUrl);
  node.setAttribute("id", id || "THEME_CHANGER");
  window.document.getElementsByTagName("head")[0].appendChild(node);

  node.onload = function() {
    // fCallback();
    if (typeof fCallback === "function") {
      fCallback.apply(this, arguments);
    }
  };
};
