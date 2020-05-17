import { styleCache, scriptCache } from './cache';
import processTpl, { genLinkReplaceSymbol, getInlineCode } from './tpl';

export const defaultFetch = window.fetch;

export const getDefaultDomain = (url: string) => {
  try {
    // URL 构造函数不支持使用 // 前缀的 url
    const href = new URL(
      url.startsWith('//') ? `${window.location.protocol}${url}` : url,
    );
    return href.origin;
  } catch (error) {
    return '';
  }
};

export const getDefaultTpl = (tpl) => tpl;

export const getEmbedHTML = (
  template: string,
  styles: string[],
  opts: { _fetch?: any } = {},
) => {
  const { _fetch = defaultFetch } = opts;
  let embedHTML = template;

  return getExternalStyleSheets(styles, _fetch).then((styleSheets) => {
    embedHTML = styles.reduce((html, styleSrc, i) => {
      html = html.replace(
        genLinkReplaceSymbol(styleSrc),
        `<style>/* ${styleSrc} */${styleSheets[i]}</style>`,
      );
      return html;
    }, embedHTML);
    return embedHTML;
  });
};

export const getExternalStyleSheets = (
  styles: string[],
  _fetch = defaultFetch,
) => {
  return Promise.all(
    styles.map((c) => {
      if (c.startsWith('<')) {
        // if it is inline style
        return getInlineCode(c);
      }
      // external styles
      // eslint-disable-next-line no-return-assign
      return (
        styleCache[c] ||
        (styleCache[c] = _fetch(c).then((response) => response.text()))
      );
    }),
  );
};

export const getExternalScripts = (scripts, _fetch = defaultFetch) => {
  return Promise.all(
    scripts.map((script) => {
      if (script.startsWith('<')) {
        // if it is inline script
        return getInlineCode(script);
      }
      // external script
      // eslint-disable-next-line no-return-assign
      return (
        scriptCache[script] ||
        (scriptCache[script] = _fetch(script).then((response) =>
          response.text(),
        ))
      );
    }),
  );
};

export function execScripts(entry, scripts, _fetch = defaultFetch) {
  return getExternalScripts(scripts, _fetch).then((scriptsText) => {

    function exec(scriptSrc, inlineScript, resolve) {
      const markName = `Evaluating script ${scriptSrc}`;
      const measureName = `Evaluating Time Consuming: ${scriptSrc}`;

      if (process.env.NODE_ENV === 'development') {
        performance.mark(markName);
      }

      if (scriptSrc === entry) {
        // noteGlobalProps();
        try {
          eval(inlineScript);
        } catch (e) {
          console.error(`error occurs while executing the entry ${scriptSrc}`);
          throw e;
        }
        resolve();
      } else {
        try {
          eval(inlineScript);
        } catch (e) {
          throw e;
        }
      }

      if (process.env.NODE_ENV === 'development') {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }

    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        const scriptSrc = scripts[i];
        const inlineScript = scriptsText[i];

        exec(scriptSrc, inlineScript, resolvePromise);
        // resolve the promise while the last script executed and entry not provided
        if (!entry && i === scripts.length - 1) {
          resolvePromise();
        } else {
          schedule(i + 1, resolvePromise);
        }
      }
    }

    return new Promise((resolve) => schedule(0, resolve));
  });
}

export const parseHtmlTpl = (tpl, domain, _fetch = defaultFetch) => {
  const assetPublicPath = `${domain}/`;
  const { template, scripts, entry, styles } = processTpl(tpl, domain);

  return getEmbedHTML(template, styles, { _fetch }).then((embedHTML) => ({
    template: embedHTML,
    assetPublicPath,
    getExternalScripts: () => getExternalScripts(scripts, _fetch),
    getExternalStyleSheets: () => getExternalStyleSheets(styles, _fetch),
    execScripts: () => {
      if (!scripts.length) {
        return Promise.resolve();
      }
      return execScripts(entry, scripts, _fetch);
    },
  }));
};
