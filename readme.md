## 说明

安装：
```shell
npm i xy-share-component
```

引用方式：
```jsx
import { RemoteComponent } from "xy-share-component";
```

> 注意. 1.0.2 版本使用systemjs进行import组件，所以需要在index.html文件里进行依赖添加
前置依赖
```html
  <!-- id不能为其他 -->
  <script id="remote-components-map" type="systemjs-importmap">
    {
      "imports": {
        "button": "http://localhost:6699/button/index.js",
        "checkbox": "http://localhost:6699/checkbox/index.js",
        "React": "https://unpkg.com/react@16/umd/react.production.min.js",
        "ReactDOM": "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js",
        "react": "https://unpkg.com/react@16/umd/react.production.min.js",
        "react-dom": "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
      }
    }
  </script>
	<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
  <script src='https://unpkg.com/systemjs@6.3.1/dist/system.js'></script>
	<script src='https://unpkg.com/systemjs@6.3.1/dist/extras/amd.js'></script>
	<script src='https://unpkg.com/systemjs@6.3.1/dist/extras/named-exports.js'></script>

  <script>
    // 必须声明此方法
    function _xyShareComponentLoader(target) {
      return System.import(target);
    }
  </script>
```

使用方式：
```jsx
// 直接url引用对应组件
<RemoteComponent url="button">test</RemoteComponent>  // 则对应上面依赖中的 http://localhost:6699/button/index.js组件
```

```tsx
// 远程加载组件可能为会网络延迟等
// 所以可以配置fallback属性在loading时候的展示；

<RemoteComponent fallback="加载中" url="button">test</RemoteComponent>
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
