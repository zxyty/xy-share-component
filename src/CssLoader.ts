export const LoadedCssStyle = {};

export const cssLoader = (sUrl: string, id?: string, fCallback?: Function) => {
  if (document.querySelector(`#${id}`)) {
    return;
  }
  const node = window.document.createElement('link');
  node.setAttribute('type', 'text/css');
  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('href', sUrl);
  node.setAttribute('id', id || 'CLOUD_COMPONENT_CHANGER');
  window.document.getElementsByTagName('head')[0].appendChild(node);

  LoadedCssStyle[sUrl] = 'loading';

  node.onload = function() {
    // fCallback();
    if (typeof fCallback === 'function') {
      fCallback.apply(this, arguments);
    }

    LoadedCssStyle[sUrl] = true;
  };

  node.onerror = function() {
    delete LoadedCssStyle[sUrl];
  };
};
