

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

  get root() {
    return this;
  }

  dispatchEvent(event: string, ...params: any[]) {
    switch (event) {

      case 'change': {
        const [value, node, ...nodes] = params;
        this._values[node.name] = value;

        this.valid = true;
        this.validate();
        this.eventEmmiter.publish('validate', this._values, node, ...nodes);
      }

      case 'error': {
        this.valid = false;
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