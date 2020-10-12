import RootNode from "./Root";
import BranchNode from "./Branch";

export default class InputNode {
  
  action = new Publisher();
  root: RootNode;
  error: string;
  dirty = false;
  touched = false;

  constructor(
    public parent: BranchNode | RootNode,
    public name: string,
    public validate: (value: any) => string
  ) {

    this.root = parent.root;
    this.revalidate();
    
    this.handleAction = this.handleAction.bind(this);
  }

  get value() {
    return this.parent.values?.[this.name];
  }

  set value(value) {
    const { parent, name } = this;
    if (parent.values == null) parent.values = {};
    parent.values[name] = value;

    this.dirty = true;
    parent.dispatchEvent('change', this);
  }

  revalidate() {
    let error = this.validate?.(this.value);
    if (error) this.root.dispatchEvent('error');
    error = error || this.parent.errors?.[this.name];
    if (this.error != error) {
      this.error = error;
      return true;
    }
    return false;
  }

  update() {
    this.action.pusblish();
  }

  handleAction(action: string, ...params: any[]) {

    switch (action) {

      case 'validate': {
        const [initiator] = params;
        if (this.revalidate() || initiator === this) this.update();
      }

      case 'reset': {
        const [lastValues] = params;
        if (
          this.revalidate()
          || this.dirty || this.touched
          || lastValues?.[this.name] != this.value
        ) {
          this.dirty = false;
          this.touched = false;
          this.update();
        }
      }

      case 'submit': {
        if (this.error && (!this.dirty || !this.touched)) {
          this.dirty = true;
          this.touched = true;
          this.update();
        }
      }

    }

  }

}