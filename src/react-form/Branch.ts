import { Publisher } from 'pubsub';
import InputNode from "./Input";
import RootNode from "./Root";
import { Branch } from './types';

export default class BranchNode {

  updateEvent = new Publisher();
  action = new Publisher();
  root: RootNode;
  children = new Map<string, InputNode | BranchNode>();
  _values: Branch;
  errors: Branch;
  dirty = false;
  touched = false;
  unsubscribe: () => void;

  constructor(
    public parent: BranchNode | RootNode,
    public name: string,
    public validate?: (values: Branch) => Branch
  ) {

    this.parent.children.set(name, this);
    this.root = parent.root;
    this._values = parent.values;
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

  get values() {
    return this._values;
  }

  set values(values) {
    const { parent, name } = this;
    this._values = values;
    if (parent.values == null) parent.values = {};
    parent.values[name] = this._values;

    this.dirty = true;
  }

  revalidate() {
    let errors = this.validate?.(this.values);
    //if (errors?.keys().length() > 0) this.root.dispatchEvent('error');
    if (errors) this.root.valid = false;
    errors = errors || this.parent.errors?.[this.name];
    //if (this.errors !== errors) {
      this.errors = errors;
    //   return true;
    // }
    // return false;
  }

  dispatchEvent(event: string, ...params: any[]) {

    switch (event) {

      case 'change': {
        this.parent.dispatchEvent('change', this, ...params);
      }

    }

  }

  update() {
    this.updateEvent.publish();
  }

  handleAction(action: string, ...params: any[]) {

    switch (action) {

      case 'validate': {
        const [initiator, ...nodes] = params;
        this.revalidate();

        if (initiator === this && nodes.length === 0) this.update();
        // if (
        //   initiator === this
        //   && (!this.dirty || nodes.length === 0)
        // ) {
        //   this.dirty = true;
        //   this.update();
        // }

        this.action.publish('validate', ...nodes);
      }

      case 'reset': {
        const [lastValues] = params;
        this.revalidate();

        this._values = this.parent.values;

        this.dirty = false;
        this.touched = false;
        // if (this.dirty || this.touched) {
        //   this.dirty = false;
        //   this.touched = false;
        //   this.update();
        // }

        this.action.publish('reset', lastValues?.[this.name]);
      }

      case 'submit': {

        this.dirty = true;
        this.touched = true;
        // if (!this.dirty || !this.touched) {
        //   this.dirty = true;
        //   this.touched = true;
        //   this.update();
        // }

        this.action.publish('submit');
      }

    }

  }
}