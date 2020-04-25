import memoize from "./memoize";
import xmlHttpRequestFetcher from "./fetcher";
import { dependenciesConfig } from "./getDependencies";
import pathjoin from "./pathJoin";

const defaultRequires = url => name => {
  throw new Error(
    `Could not require '${name}'. The 'requires' function was not provided ----> [${url}]`
  );
};

const requireReg = /require\(('|")([\s\S]*?)('|")\)/g;
const keyReg = /"([\s\S]*?)"/g;

const getAllRelativeFile = async (url, fetcher) => {
  if (!dependenciesConfig.remoteDepFile[url]) {
    const reponseData = await fetcher(url);
    dependenciesConfig.remoteDepFile[url] = reponseData;
  } else {
    return;
  }

  const matchResult = dependenciesConfig.remoteDepFile[url].match(requireReg)!;

  if (!matchResult) {
    return;
  }

  const { origin, pathname } = new URL(url);

  const nextRequestFilePath = matchResult
    .map(c => {
      const matchKeys = c.match(keyReg)!;
      const key = matchKeys[0].replace(/"/g, "");

      if (key.startsWith("./") || key.startsWith("../")) {
        return pathjoin(pathname, `../${key}`);
      }

      return null;
    })
    .filter(c => c)
    .map(key => {
      if (key.endsWith("style")) {
        return `${origin}${key}/index.css`.replace(/\\/g, "/");
      }
      if (key.endsWith(".css")) {
        return origin + key.replace(/\\/g, "/");
      }
      // 判断是否是图片文件
      // Todo
      // 判断是否是json文件
      // Todo
      // 则最后则是js文件
      const tempStr = origin + (key.endsWith(".js") ? key : `${key}.js`);
      return tempStr.replace(/\\/g, "/");
    });

  for (let i = 0; i < nextRequestFilePath.length; i += 1) {
    await getAllRelativeFile(nextRequestFilePath[i], fetcher);
  }
};

export const createLoadRemoteModule = ({
  requires = defaultRequires,
  fetcher = xmlHttpRequestFetcher
} = {}) =>
  memoize(async url => {
    await getAllRelativeFile(url, fetcher);

    return Object.keys(dependenciesConfig.remoteDepFile)
      .filter(c => c.endsWith(".js"))
      .reverse()
      .reduce((_, key) => {
        const exports = {};
        const module = { exports };

        // eslint-disable-next-line no-new-func
        const func = new Function(
          "require",
          "module",
          "exports",
          dependenciesConfig.remoteDepFile[key] as string
        );

        func(requires(url), module, exports);
        dependenciesConfig.remoteDepFile[key] = module.exports;
        return module.exports;
      }, null);
  });
