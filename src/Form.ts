

export default class RootNode {

  values: { [key: string]: any } | any[];

  valid = true;

  eventEmmiter = new Publisher();

  constructor() {
    
    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
  }

  dispatchValuesChangeEvent(...callers) {
    this.valid = true;
    this.validate();
    this.valuesChangeEvent.publish(...callers);
    this.validateEvent.publish(false);
  }

  validate() {
    this.valid = true;
    this.errors = this.props.validate?.(this.values)
    |> # == null && [] || [#];
  }

  reset() {
    const prevValues = this.values;
    this.initialize();
    this.resetEvent.publish(prevValues);
  }

  submit() {

  }

  
  
}