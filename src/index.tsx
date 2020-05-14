import React, { useState, useEffect, FunctionComponent } from 'react';
import VueMountComponent from './VueComponent';

import { LoadedCssStyle, cssLoader } from './CssLoader';

interface StatePropsType {
  loading?: boolean;
  err?: any;
  Component?: any;
}

const LoadedComponents = {};

export const createUseRemoteComponent = () => {
  const remoteLoader = window._xyShareComponentLoader;
  const useRemoteComponent = target => {
    const scriptTxt = document.querySelector('#remote-components-map')
      ?.innerHTML;
    const imports = JSON.parse(scriptTxt || '{}')?.imports;

    const realUrl = imports[target] || '';
    if (!realUrl) {
      return [];
    }

    // load target css/style
    let $name;
    const styleUrl = realUrl.replace(
      new RegExp(`${target}/([\\s\\S]*?)\.js`),
      (_, $1) => {
        $name = $1;
        return `${target}/${$1}.css`;
      },
    );

    if (!LoadedCssStyle[styleUrl]) {
      cssLoader(styleUrl, `${target}_${$name || ''}`);
    }

    const [{ loading, err, Component }, setState] = useState<StatePropsType>({
      loading: true,
      err: undefined,
      Component: undefined,
    });

    if (!LoadedComponents[target]) {
      LoadedComponents[target] = remoteLoader(target);
    }

    useEffect(() => {
      LoadedComponents[target]
        .then(module => {
          setState({ loading: false, Component: module.default });
          LoadedComponents[target] = new Promise(res => {
            res(module);
          });
        })
        .catch(e => setState({ loading: false, err: e }));
    }, [target]);

    return [loading, err, Component];
  };

  return useRemoteComponent;
};

const useRemoteComponent = createUseRemoteComponent();

export function useShareComponent<T extends Record<string, any>>(
  url: string,
  fallback: React.ReactNode = null,
  usestatic = '',
): FunctionComponent<T & { children?: React.ReactNode }> {
  return function ShareComponent(
    props: any = {},
  ): React.ReactElement<any, any> {
    const [loading, err, Component] = useRemoteComponent(url)!;

    if (loading) {
      return <React.Fragment>{fallback}</React.Fragment>;
    }

    if (err || !Component) {
      return <div>Unknown Error: {(err || 'UNKNOWN').toString()}</div>;
    }

    // 如果是使用的静态类组件
    if (usestatic && Component[usestatic]) {
      const StaticComponent = Component[usestatic];
      return <StaticComponent {...props} />;
    }

    if ('_compiled' in Component && Component._compiled) {
      // should be vue
      return <VueMountComponent {...props} definition={Component} />;
    }

    return <Component {...props} />;
  };
}
