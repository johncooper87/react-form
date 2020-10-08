import RootNode from "./Root";

export default class BranchNode {
  protected parent: BranchNode | RootNode;
  protected name: string;

  //values: { [key: string]: any } | any[];

  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  get values() {
    const { parent, name } = this;
    return parent.values?.[name];
  }

  set values(values) {
    const { parent, name } = this;
    if (parent.values == null) parent.values = {};
    parent.values[name] = values;
  }

  get initialValues() {
    const { parent, name } = this;
    return parent.initialValues?.[name];
  }

  dispatchEvent(event: string, ...args: any[]) {
    this.parent.dispatchEvent(event, this, ...args);
  }
}