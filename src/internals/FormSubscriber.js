export class FormSubscriber {

  dirty = false;
  touched = false;
  submitErrors = undefined;

  constructor(forceUpdate, composer) {
    this.props = {
      forceUpdate,
      composer
    };

    this.handleValidateEvent = this.handleValidateEvent.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleCompleteEvent = this.handleCompleteEvent.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  get form() {
    return this.props.composer.form;
  }

  handleValidateEvent(init) {
    if (init) {
      if (this.hasErrors !== this.form.hasErrors || this.dirty || this.touched) {
        this.dirty = false;
        this.touched = false;
        this.submitErrors = undefined;
        this.hasErrors = this.form.hasErrors;
        this.props.forceUpdate();
      }
    } else if (this.hasErrors !== this.form.hasErrors || !this.dirty) {
      this.dirty = true;
      this.hasErrors = this.form.hasErrors;
      this.props.forceUpdate();
    }
  }

  handleSubmitEvent() {
    if (!this.form.hasErrors) {
      this.touched = true;
      this.submitErrors = undefined;
      this.props.forceUpdate();
    } else if (!this.touched) {
      this.touched = true;
      this.hasErrors = true;
      this.props.forceUpdate();
    }
  }

  handleCompleteEvent() {
    if (this.form.submitErrors != null) {
      this.submitErrors = this.form.submitErrors;
      this.props.forceUpdate();
    }
  }

  subscribeToEvents() {
    this.validateSub = this.form.validateEvent.subscribe(this.handleValidateEvent);
    this.submitSub = this.form.submitEvent.subscribe(this.handleSubmitEvent);
    this.completeSub = this.form.completeEvent.subscribe(this.handleCompleteEvent);
  }

  unsubscribeFromEvents() {
    this.validateSub.unsubscribe();
    this.submitSub.unsubscribe();
    this.completeSub.unsubscribe();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}