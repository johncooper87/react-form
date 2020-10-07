import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { FormSubscriber } from '../internals/FormSubscriber';
import { ComposerContext } from '../components/Fields';

export function useFormSubscriber(composer) {

  const _composer = composer || useContext(ComposerContext);
  const forceUpdate = useForceUpdate();
  const formSub = useMemo(() => new FormSubscriber(forceUpdate, _composer), []);

  useEffect(formSub.handleSubscriptions, []);
  
  return {
    hasErrors: formSub.hasErrors,
    dirty: formSub.dirty,
    touched: formSub.touched,
    submitErrors: formSub.submitErrors,
    submit: formSub.form.submit,
    reset: formSub.form.reset
  };
}