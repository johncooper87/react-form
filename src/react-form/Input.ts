import { Publisher } from 'pubsub';
import RootNode from "./Root";
import BranchNode from "./Branch";
//import {  } from './types';

export default class InputNode<T = any> {
  
  updateEvent = new Publisher();
  root: RootNode;
  error: string;
  dirty = false;
  touched = false;
  unsubscribe: () => void;

  constructor(
    public parent: BranchNode | RootNode,
    public name: string,
    public validate?: (value: T) => string
  ) {

    this.parent.children.set(name, this);
    this.root = parent.root;
    this.revalidate();
    
    this.handleAction = this.handleAction.bind(this);
    this.unsubscribe = this.parent.action.subscribe(this.handleAction);
  }

  __RELEASE() {
    if (this.updateEvent.isEmpty) return;
    this.unsubscribe();
    this.parent.children.delete(this.name);
    this.parent.__RELEASE();
    this.parent = undefined;
    this.root = undefined;
  }

  get value(): T {
    return this.parent.values?.[this.name];
  }

  set value(value: T) {
    const { parent, name } = this;
    if (parent.values == null) parent.values = {};
    parent.values[name] = value;

    this.dirty = true;
    parent.dispatchEvent('change', this);
  }

  revalidate() {
    let error = this.validate?.(this.value);
    if (error) this.root.valid = false;
    error = error || this.parent.errors?.[this.name];
    if (this.error != error) {
      this.error = error;
      return true;
    }
    return false;
  }

  update() {
    this.updateEvent.publish();
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