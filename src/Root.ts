

export default class RootNode {

  values: { [key: string]: any } | any[] = {};

  valid = true;
  errors = undefined;
  initialValues = {};
  _validate = undefined;
  handleSubmit = undefined;
  submitErrors = undefined;

  eventEmmiter = new Publisher();

  constructor(handleSubmit, validate) {
    this.handleSubmit = handleSubmit;
    this._validate = validate;
    
    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
  }

  dispatchEvent(event: string, ...args: any[]) {
    switch (event) {
      case 'change': {
        this.valid = true;
        this.validate(); 
        this.eventEmmiter.publish('validate', ...args);
      }
    }
  }

  validate() {
    this.errors = this._validate?.(this.values);
  }

  reset(initialValues) {
    const prevValues = this.values;

    if (initialValues != null) this.initialValues = initialValues;
    this.values = copy(this.initialValues);
    this.valid = true;
    this.validate();

    this.eventEmmiter.publish('reset', prevValues);
  }

  async submit() {
    this.eventEmmiter.publish('submit');
    if (this.valid) {
      this.submitErrors = await this.handleSubmit?.(this.values);
      this.eventEmmiter.publish('complete');
      // if (this.submitErrors == null) this.onSubmitted?.(this.values);
      // else this.onSubmitErrors?.(this.submitErrors, this.values);
    }
  }

  
  
}