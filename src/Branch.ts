import RootNode from "./Root";

export default class BranchNode {

  private updateEvent = new Publisher();
  private action = new Publisher();
  root: RootNode;
  _values: { [key: string]: any } | any[];
  errors: { [key: string]: any } | any[];
  dirty = false;
  touched = false;

  //values: { [key: string]: any } | any[];

  constructor(
    public parent: BranchNode | RootNode,
    public name: string,
    public validate: (values: { [key: string]: any } | any[]) => { [key: string]: any } | any[]
  ) {

    this.root = parent.root;
    this.revalidate();
  }

  get values() {
    return this._values;
  }

  set values(value) {
    const { parent, name } = this;
    this._values = value;
    if (parent.values == null) parent.values = {};
    parent.values[name] = this._values;
  }

  revalidate() {
    const errors = this._validate?.(this.values);
    //if (errors?.keys().length() > 0) this.root.dispatchEvent('error');
    if (errors) this.root.dispatchEvent('error');
    return errors || this.parent.errors?.[this.name];
  }

  dispatchEvent(event: string, ...params: any[]) {

    switch (event) {

      case 'change': {
        this.parent.dispatchEvent('change', this, ...params);
      }
    }

  }

  private handleAction(action: string, ...params: any[]) {

    switch (action) {

      case 'validate': {
        const [initiator, ...nodes] = params;
        const errors = this.revalidate();
        if (this.errors != errors || initiator === this) {
          this._errors = errors;
          this.action.publish('validate', ...nodes);
        }
      }

      case 'reset': {
        const [previousValues] = params;
        const _previousValues = previousValues?.[this.name];
        const errors = this.revalidate();
        if (
          this.errors != errors
          || this.dirty || this.touched
          || _previousValues != this.values
        ) {
          this._errors = errors;
          this._dirty = false;
          this._touched = false;
          this.action.publish('validate', _previousValues);
        }
      }

      case 'submit': {
        if (this.errors && (!this.dirty || !this.touched)) {
          this._dirty = true;
          this._touched = true;
          this.action.publish('submit');
        }
      }

    }

  }
}