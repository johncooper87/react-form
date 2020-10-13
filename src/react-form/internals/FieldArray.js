import { Composite } from './Composite';
import { ArrayElement } from './ArrayElement';
//import { copy } from './copy';

export class FieldArray extends Composite {
  elements = [];

  constructor(forceUpdate, composer, name, validate, validateElement) {
    super(forceUpdate, composer, name, validate);

    this.props.validateElement = validateElement;
    this.map = this.map.bind(this);
    this.push = this.push.bind(this);

    if (this.values?.length) this.elements.push(
      ...this.values.map(
        (value, index) => {
          const element = new ArrayElement(this, String(index), this.props.validateElement, index);
          element.subscribeToEvents();
          return element;
        }
      )
    );
  }

  get nextKey() {
    return this.elements.length ? this.elements[this.elements.length - 1].key + 1 : 0;
  }

  map(callback) {
    return this.elements.map(el => callback(el.key, el));
  }

  push(value) {
    if (this.values == null) this.values = [];
    this.values.push(value);
    //this.props.composer.dispatchValuesChangeEvent(this);
    this.dispatchValuesChangeEvent();
  }

  shouldUpdateOnValuesChange(...args) {
    //TODO:
    //if (this.elements.length !== this.values.length) return true;
    if (this.elements.length !== (this.values?.length || 0)) return true;
    return super.shouldUpdateOnValuesChange(...args);
  }

  shouldUpdateOnReset(...args) {
    if (this.elements.length !== (this.values?.length || 0)) return true;
    return super.shouldUpdateOnReset(...args);
  }

  handleValuesChange(...args) {
    let element;
    //TODO: 
    //if (this.values.length !== this.elements.length) {
    if (this.elements.length !== (this.values?.length || 0)) {
      element = new ArrayElement(this, String(this.elements.length), this.props.validateElement, this.nextKey);
      this.elements.push(element);
    }
    super.handleValuesChange(...args);
    element?.subscribeToEvents();
  }

  handleReset(error, prevValues) {
    const initialLength = this.values?.length || 0;
    const difference = this.elements.length - initialLength;
    if (difference > 0) {
      for (let index = initialLength; index < this.elements.length; index++) this.elements[index].unsubscribeFromEvents();
      this.elements.splice(initialLength, difference);
    } else {
      for (let index = -difference; index > 0; index--) {
        const element = new ArrayElement(this, String(this.elements.length), this.props.validateElement, this.nextKey);
        element.subscribeToEvents();
        this.elements.push(element);
      }
    }
    super.handleReset(error, prevValues);
  }

  // handleSerialize() {
  //   if (this.dirty) this.serializedValues = copy(this.values);
  //   super.handleSerialize();
  // }
}