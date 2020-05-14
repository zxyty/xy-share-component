import React from 'react';
import Vue from 'vue';

interface VueComponentProps {
  definition?: {
    beforeCreate: Function[];
    data: Function;
    name: string;
    render: Function;
    staticRenderFns: any[];
  };
}

// 考虑
// 接管Vue对应的生命周期
// 及构建sandbox

export default class VueComponent extends React.PureComponent<
  VueComponentProps
> {
  mountRef: InstanceType<typeof HTMLDivElement> | null = null;

  componentDidMount() {
    const { definition, children, ...rest } = this.props;
    const Com = Vue.component(
      definition?.name || 'remote-vue-component',
      definition as any,
    );
    setTimeout(() => {
      new Com({
        propsData: rest,
      }).$mount(this.mountRef);
    });
  }

  saveRef = ref => {
    this.mountRef = ref;
  };

  render() {
    return <div ref={this.saveRef} />;
  }
}
