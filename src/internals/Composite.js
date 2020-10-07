import { Composer } from './Composer';
import { transit } from './transit';
import { notNull, firstElement } from './_shared';
import { copy } from './copy';

export class Composite extends Composer {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate) {
    super(forceUpdate, ...transit(composer, name), validate);

    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur({ currentTarget, relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
      && !currentTarget.contains(relatedTarget)
    ) {
      this.touched = true;
      this.props.forceUpdate();
    }
  }

  handleValidation() {
    const errors = this.validate(this.values);
    this.errors = errors.map(firstElement).filter(notNull);
    return errors[0]?.[1];
  }

  shouldUpdateOnValuesChange(error, caller, ...callers) {
    return this.error !== error || (caller === this && (!this.dirty || callers.length === 0));
  }

  shouldUpdateOnReset(error) {
    return this.error !== error || this.dirty || this.touched;
  }

  shouldUpdateOnSubmit() {
    return this.error && (!this.dirty || !this.touched);
  }

  handleValuesChange(error, caller, ...callers) {
    this.error = error;
    if (caller === this) this.dirty = true;
    super.handleValuesChange(error, caller, ...callers);
  }

  handleReset(error, prevValues) {
    this.error = error;
    this.dirty = false;
    this.touched = false;
    super.handleReset(error, prevValues);
  }

  handleSubmit() {
    if (this.error) {
      this.dirty = true;
      this.touched = true;
    }
    super.handleSubmit();
  }

  handleSerialize(forceSerialize) {
    const _forceSerialize = forceSerialize || this.dirty;
    if (_forceSerialize) this.serializedValues = copy(this.values);
    super.handleSerialize(_forceSerialize);
  }
}