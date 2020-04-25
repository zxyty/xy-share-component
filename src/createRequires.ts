import join from "./pathJoin";
import { cssLoader } from "./utils";
import { md5 } from "./md5";
import { dependenciesConfig } from "./getDependencies";

const resolveDependencies = target => {
  if (target.isRemote) {
    if (target.value.endsWith(".css")) {
      cssLoader(target.value, null, `css_id_${md5(target.key)}`);
      return false;
    }

    const cache = dependenciesConfig.remoteDepFile[target.key];

    if (cache) {
      if (!Object.keys(dependenciesConfig.cache).find(c => c === target.key)) {
        dependenciesConfig.cache.push({
          [target.key]: cache
        });
      }

      delete dependenciesConfig.remoteDepFile[target.key];

      return cache;
    }

    return undefined;
  }
  const dep = dependenciesConfig.cache.find(
    c => target.key === Object.keys(c)[0]
  );
  if (!dep) {
    console.warn(`请添加${target.value}模块在配置里`);
    return undefined;
  }
  return false;
};

const checkKeyPath = (origin, pathname, key) => {
  const currPath = join(pathname, `../${key}`);
  if (key.startsWith("./") || key.startsWith("../")) {
    // 判断是否是style文件
    if (key.endsWith("style")) {
      const tempStr = `${origin + currPath.replace(/\\/g, "/")}/index.css`;
      return {
        value: tempStr,
        key: tempStr,
        isRemote: true
      };
    }
    if (key.endsWith(".css")) {
      const tempStr = `${origin + currPath.replace(/\\/g, "/")}`;
      return {
        value: tempStr,
        key: tempStr,
        isRemote: true
      };
    }
    // 判断是否是图片文件
    // Todo
    // 判断是否是json文件
    // Todo

    // 则最后则是js文件
    const tempStr = `${origin +
      currPath.replace(/\\/g, "/") +
      (key.endsWith(".js") ? "" : ".js")}`;
    return {
      value: tempStr,
      key: tempStr,
      isRemote: true
    };
  }

  return {
    key,
    value: key,
    isRemote: false
  };
};

export const createRequires = () => url => {
  const { origin, pathname } = new URL(url);

  return (name => {
    const resultDependency = checkKeyPath(origin, pathname, name);

    const resolveDependencyResult = resolveDependencies(resultDependency);
    // if (resolveDependencyResult) {
    //   console.info("import from other file: ", resolveDependencyResult);
    // }

    const dep = dependenciesConfig.cache.find(
      c => resultDependency.key === Object.keys(c)[0]
    );

    if (resultDependency.key.endsWith(".css")) {
      return null;
    }

    if (!dep || resolveDependencyResult === undefined) {
      throw new Error(
        `Could not require '${name}'. '${name}' does not exist in dependencies. -----> [${url}]`
      );
    }

    if (dep) {
      return resolveDependencyResult || Object.values(dep)[0];
    }

    throw new Error(
      `Could not require '${name}'. '${name}' does not exist in dependencies. -----> [${url}]`
    );
  }) as any;
};
