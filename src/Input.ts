import RootNode from "./Root";
import BranchNode from "./Branch";


export default class InputNode {
  dirty = false;
  touched = false;
  update = (...args) => new Publisher().publish(...args);
  dispatchEvent = (...args) => this.parent.dispatchEvent(...args);

  protected _error: string;
  protected _validate: (value: any) => string;

  constructor(
    protected parent: BranchNode | RootNode,
    protected name: string
  ) {
    
    this.handleAction = this.handleAction.bind(this);
  }

  get value() {
    const { parent, name } = this;
    return parent.values?.[name];
  }

  set value(value) {
    const { parent, name } = this;
    if (parent.values == null) parent.values = {};
    parent.values[name] = value;

    this.dirty = true;
    dispatchEvent('change', this);
  }

  get initialValue() {
    const { parent, name } = this;
    return parent.initialValues?.[name];
  }

  get error() {
    return this._error;
  }

  set validate(value) {
    const { _validate } = this;
    if (_validate === value) return;
    this._validate = value;
    const { parent, name, _error, update } = this;
    const error = _validate?.(value) || parent.errors?.[name];
    if (_error != error) {
      this._error = error;
      update();
    }
  }

  handleAction(action: string, ...params: any[]) {

    switch (action) {

      case 'validate': {
        const [initiator] = params;
        const { _validate, value, name, _error, update } = this;
        const error = _validate?.(value) || parent.errors?.[name];
        if (_error != error || initiator === this) {
          this._error = error;
          update();
        }
      }

      case 'reset': {
        const [prevValues] = params;
        const { _validate, value, name, _error, dirty, touched, update } = this;
        const error = _validate?.(value) || parent.errors?.[name];
        if (
            _error != error
            || dirty || touched
            || prevValues?.[name] != value
        ) {
          this._error = error;
          this.dirty = false;
          this.touched = false;
          update();
        }
      }

      case 'submit': {
        const { _error, dirty, touched, update } = this;
        if (_error && (!dirty || !touched)) {
          this.dirty = true;
          this.touched = true;
          update();
        }
      }

    }

  }

}