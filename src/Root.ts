import { Branch } from './types';

export default class RootNode {

  updateEvent = new Publisher();
  action = new Publisher();
  values: Branch;
  errors: Branch;
  valid = true;
  root = this;
  submitErrors: any;
  dirty = false;
  touched = false;

  constructor(
    public handleSubmit: (values: Branch) =>  Promise<any>,
    public initialValues = {},
    public validate: (values: Branch) => Branch
  ) {
    
    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
  }

  revalidate() {
    let errors = this.validate?.(this.values);
    if (errors) this.valid = false;
    this.errors = errors;
  }

  dispatchEvent(event: string, ...params: any[]) {
    switch (event) {

      case 'change': {
        this.valid = true;
        this.dirty = true;
        this.revalidate();
        this.action.publish('validate', ...params);
      }
    }
  }

  __RELEASE() {
  }

  update() {
    this.updateEvent.pusblish();
  }

  reset(initialValues) {

    if (initialValues != null) {
      if (initialValues === this.initialValues) return;
      this.initialValues = initialValues;
    }
    const lastValues = this.values;
    this.values = copy(this.initialValues);
    this.valid = true;
    this.revalidate();

    this.action.publish('reset', lastValues);

    this.dirty = false;
    this.touched = false;
    this.update();
  }

  async submit() {
    this.action.publish('submit');

    this.touched = false;
    this.update();

    if (this.valid) {
      this.submitErrors = await this.handleSubmit?.(this.values);
      this.action.publish('complete');
    }
  }

  
  
}