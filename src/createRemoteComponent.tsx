import React from "react";
import { createUseRemoteComponent } from "./hook/useRemoteComponent";

export const createRemoteComponent = options => {
  const useRemoteComponent = createUseRemoteComponent(options);

  const RemoteComponent = (config: any) => {
    const { url, fallback = null, use = null, children, props = {} } = config;
    const [loading, err, Component] = useRemoteComponent(url);

    if (loading) {
      return fallback;
    }

    if (err || !Component) {
      return <div>Unknown Error: {(err || "UNKNOWN").toString()}</div>;
    }

    if (children) {
      props.children = children;
    }

    // 如果是使用的静态类组件
    if (use && Component[use]) {
      const StaticComponent = Component[use];
      return <StaticComponent {...props} />;
    }



    return <Component {...props} />;
  };

  return RemoteComponent;
};
