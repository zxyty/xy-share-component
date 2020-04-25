import { ReactElement } from "react";
import { createRequires } from "../createRequires";
import { initDependencies } from "../getDependencies";
import { createRemoteComponent } from "../createRemoteComponent";

initDependencies();
const requires = createRequires();

type RemoteComponentType = {
  url: string;
  fallback?: React.ReactNode;
  use?: string; // 使用的静态属性
  props?: {
    [key: string]: any;
  };
} & Readonly<{ children?: React.ReactNode }>;

export const RemoteComponent = createRemoteComponent({ requires }) as (
  props: RemoteComponentType
) => ReactElement;
