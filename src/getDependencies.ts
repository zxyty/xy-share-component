const cannotFindModule = err =>
  err &&
  typeof err.message === "string" &&
  err.message.indexOf("Cannot find module") > -1;

export const dependenciesConfig: {
  cache: any[];
  remoteDepFile: {
    [key: string]: any;
  };
} = {
  cache: [],
  remoteDepFile: {}
};

export const initDependencies = () => {
  if (dependenciesConfig.cache.length) {
    return dependenciesConfig.cache;
  }
  let selfConfig = [];
  try {
    selfConfig = require("../../../remote-component-config").dependencies;
  } catch (err) {
    // istanbul ignore next: This is just too impossible to test
    if (!cannotFindModule(err)) {
      throw err;
    }

    // return [{
    //   react: require("react")
    // }];
  }

  dependenciesConfig.cache = [
    ...require("../_remotePack").default,
    ...selfConfig
  ];

  return dependenciesConfig.cache;
};
