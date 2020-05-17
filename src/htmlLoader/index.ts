import { embedHTMLCache } from './cache';
import {
  defaultFetch,
  getDefaultDomain,
  getDefaultTpl,
  parseHtmlTpl,
} from './utils';

export default function importHTML(
  url,
  opts: { fetch?: any; getDefaultDomain?: any; getDefaultTpl?: any } = {},
) {
  if (embedHTMLCache[url]) {
    return url;
  }
  const _fetch = opts.fetch || defaultFetch;
  const getDomain = opts.getDefaultDomain || getDefaultDomain;
  const getTemplate = opts.getDefaultTpl || getDefaultTpl;

  embedHTMLCache[url] = _fetch(url)
    .then(response => response.text())
    .then(html => {
      const domain = getDomain(url);
      const tpl = getTemplate(html);
      return parseHtmlTpl(tpl, domain);
    });

  return embedHTMLCache[url];
}
