import RootNode from "./Form";


abstract class ValueNode {
  protected parentNode: BranchNode | RootNode;
  protected name: string;

  constructor(parentNode, name) {
    this.parentNode = parentNode;
    this.name = name;

    //this.handleEvent = this.handleEvent.bind(this);
  }

  //abstract handleEvent(event: string): boolean;
}

class BranchNode extends ValueNode {
  values: { [key: string]: any } | any[];
}

export default class InputNode extends ValueNode {
  dirty = false;
  touched = false;
  updateEvent = new Publisher();

  constructor(parentNode, name) {
    super(parentNode, name);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  get value() {
    return this.parentNode.values?.[this.name];
  }

  set value(value) {
    if (this.parentNode.values == null) this.parentNode.values = {};
    this.parentNode.values[this.name] = value;
  }

  get initialValue() {
    return this.parentNode.initialValues?.[this.name];
  }

  handleChange(event) {
    this.dirty = true;
    this.parentNode.dispatchChangeEvent(this);
  }

  handleBlur({ relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
    ) {
      this.touched = true;
      this.updateEvent.publish();
    }
  }

  handleEvent(event: string) {

    let shouldUpdate = false;

    switch (event) {

      case 'chnage': {
        this.error = this.validate(this.value);
      }

      case 'reset': {
        shouldUpdate = this.error !== error || this.dirty || this.touched || prevValue !== this.value;
        this.error = error;
        this.dirty = false;
        this.touched = false;
      }

      case 'submit': {
        shouldUpdate = this.error && (!this.dirty || !this.touched);
        if (this.error) {
          this.dirty = true;
          this.touched = true;
        }
      }

    }

    return shouldUpdate;

  }

}