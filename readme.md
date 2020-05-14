## 说明

安装：
```shell
npm i --save xy-share-component
```

引用方式：
```jsx
import { useShareComponent } from "xy-share-component";
```

> 注意. 1.0.2 版本后使用systemjs进行import组件，所以需要在index.html文件里进行依赖添加
前置依赖
```html
  <!-- 建议此种script加载可于另外加载一个components-mapping 这样方便修改部署 -->
  <script>
    // 必须声明此方法
    function _xyShareComponentLoader(target) {
      return System.import(target);
    }
  </script>
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
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.11"></script>
  <script src='https://unpkg.com/systemjs@6.3.1/dist/system.js'></script>
	<script src='https://unpkg.com/systemjs@6.3.1/dist/extras/amd.js'></script>
	<script src='https://unpkg.com/systemjs@6.3.1/dist/extras/named-exports.js'></script>

```

使用方式：
```jsx
import { useShareComponent } from 'xy-share-component';

// 直接使用systemjs mapping 关系引用对应组件
const Button = useShareComponent('button'); 
// 则对应上面依赖中的 http://localhost:6699/button/index.js组件

export default () => {
  return (
    <div>
      <Button type="primary">Test</Button>
      <Button type="primary">Test2</Button>
      <Button type="primary">Test3</Button>
      <Button type="primary">Test13223</Button>
    </div>
  );
};
```

远程组件props类型提示：
```jsx
import { useShareComponent } from 'xy-share-component';

// 导入对应的Button 定义文件
// example: 
interface ButtonProps {
  type: 'primary';
}
// or import ButtonProps from 'xxxx';

const Button = useShareComponent<ButtonProps>('button'); 

// 则使用的Button组件在编码coding时 例如vscode等ide会有props提示
export default () => {
  return (
    <div>
      <Button type="primary">Test</Button>
      <Button type="primary">Test2</Button>
      <Button type="primary">Test3</Button>
      <Button type="primary">Test13223</Button>
    </div>
  );
};
```

`fallback`属性设置loading
```tsx
// 远程加载组件可能为会网络延迟等
// 所以可以配置fallback属性在loading时候的展示；
import { useShareComponent } from 'xy-share-component';

const Button = useShareComponent('button', '加载中...'); 
// or
const Button = useShareComponent('button', <div>加载中</div>);
```

引用远程组件静态属性：`useStatic`
```tsx
// 一些组件加载后默认导出时只有组件本身的内容
// 而存在一些静态属性的情况则可以使用useStatic进行指定
import { useShareComponent } from 'xy-share-component';


// 比如Button上有一个Group的静态属性
const Group = useShareComponent('button', '加载中...', 'Group'); 
```

`useShareComponent`Api如下
```ts
function useShareComponent<T extends Record<string, any>>(
  url: string,
  fallback: React.ReactNode = null,
  usestatic = '',
);
```
