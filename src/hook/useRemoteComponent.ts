import { useState, useEffect } from "react";
import { createLoadRemoteModule } from "../loadRemoteModule";

interface StatePropsType {
  loading?: boolean;
  err?: any;
  Component?: any;
}

export const createUseRemoteComponent = args => {
  const remoteLoader = createLoadRemoteModule(args);
  const useRemoteComponent = url => {
    const [{ loading, err, Component }, setState] = useState<StatePropsType>({
      loading: true,
      err: undefined,
      Component: undefined
    });

    useEffect(() => {
      remoteLoader(url)
        .then(module => {
          setState({ loading: false, Component: module.default });
        })
        .catch(e => setState({ loading: false, err: e }));
    }, [url]);

    return [loading, err, Component];
  };

  return useRemoteComponent;
};
