import RootNode from "./Root";
import BranchNode from "./Branch";

export default class InputNode {
  
  private updateEvent = new Publisher();
  private _parent: BranchNode | RootNode;
  private _name: string;
  private _root: RootNode;
  private _validate: (value: any) => string;
  private _error: string;
  private _dirty = false;
  private _touched = false;

  constructor(
    parent: BranchNode | RootNode,
    name: string,
    validate: (value: any) => string
  ) {

    this._parent = parent;
    this._name = name;
    this._root = parent.root;
    this._validate = validate;
    
    this.handleAction = this.handleAction.bind(this);
  }

  get parent() { return this._parent; }
  get name() { return this._name; }
  get root() { return this._root; }
  get error() { return this._error; }
  get dirty() { return this._dirty; }
  get touched() { return this._touched; }

  get value() {
    return this.parent.values[this.name];
  }

  set value(value) {
    const { parent, name } = this;
    if (parent.values == null) parent.values = {};
    parent.values[name] = value;

    this._dirty = true;
    parent.dispatchEvent('change', this);
  }

  private getError() {
    const error = this._validate?.(this.value);
    if (error) this.root.dispatchEvent('error');
    return error || this.parent.errors?.[this.name];
  }

  private update() {
    this.updateEvent.pusblish();
  }

  private handleAction(action: string, ...params: any[]) {

    switch (action) {

      case 'validate': {
        const [initiator] = params;
        const error = this.getError();
        if (this.error != error || initiator === this) {
          this._error = error;
          this.update();
        }
      }

      case 'reset': {
        const [previousValues] = params;
        const error = this.getError();
        if (
          this.error != error
          || this.dirty || this.touched
          || previousValues?.[this.name] != this.value
        ) {
          this._error = error;
          this._dirty = false;
          this._touched = false;
          this.update();
        }
      }

      case 'submit': {
        if (this.error && (!this.dirty || !this.touched)) {
          this._dirty = true;
          this._touched = true;
          this.update();
        }
      }

    }

  }

}