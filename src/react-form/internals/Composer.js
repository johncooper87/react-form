import { Publisher } from '@kemsu/publisher';
import { Subscriber } from './Subscriber';
import { copy } from './copy';

export class Composer extends Subscriber {
  valuesChangeEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();
  serializeEvent = new Publisher();

  get form() {
    return this.props.composer.form;
  }

  get values() {
    return this.props.composer.values?.[this.props.name];
  }

  set values(values) {
    if (this.props.composer.values == null) this.props.composer.values = {};
    this.props.composer.values[this.props.name] = values;
  }

  get initialValues() {
    return this.props.composer.initialValues?.[this.props.name];
  }
  get serializedValues() {
    return this.props.composer.serializedValues?.[this.props.name];
  }
  set serializedValues(serializedValues) {
    const { name, composer } = this.props;
    if (composer.values) {
      if (composer.serializedValues == null) composer.serializedValues = copy(composer.values);
      composer.serializedValues[name] = serializedValues;
    }
  }

  dispatchValuesChangeEvent(...callers) {
    this.props.composer.dispatchValuesChangeEvent(this, ...callers);
  }

  handleValuesChange(error, caller, ...callers) {
    this.valuesChangeEvent.publish(...callers);
  }

  handleReset(error, prevValues) {
    this.resetEvent.publish(prevValues);
  }

  handleSubmit() {
    this.submitEvent.publish();
  }

  handleSerialize(forceSerialize = false) {
    this.serializeEvent.publish(forceSerialize);
  }
}