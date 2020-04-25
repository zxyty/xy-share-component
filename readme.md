## 说明

安装：
```shell
npm i xy-share-component
```

引用方式：
```jsx
// 必须以RemoteComponent命名引用组件
import { RemoteComponent } from "xy-share-component";
```

使用方式：
```jsx
// 直接url引用对应组件
<RemoteComponent url="http://localhost:6868/button/index">test</RemoteComponent>
```

```tsx
// 远程加载组件可能为会网络延迟等
// 所以可以配置fallback属性在loading时候的展示；

<RemoteComponent fallback="加载中" url="api1/button/index">test</RemoteComponent>
```

```jsx
// 使用别名 api1 ---> http://localhost:6868
// 需要配置remote-components-config.js 在根目录下
<RemoteComponent url="api1/button/index">test</RemoteComponent>
```

`remote-components-config.js`配置如下：
```js
// remote-components-config.js
module.exports = {
  alias: {
    app1: "http://localhost:8686/remote-components"
  },
  dependencies: [
    {
      "react-dom": require("react-dom")
    }
  ]
};
```

`RemoteComponent`更多属性API如下：
```ts
type RemoteComponentType = {
  url: string;
  fallback?: React.ReactNode;
  use?: string; // 使用的静态属性
  props?: {     // 传给远程组件的props属性
    [key: string]: any;
  };
} & Readonly<{ children?: React.ReactNode }>;
```
