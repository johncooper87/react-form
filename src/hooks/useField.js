import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { Field } from '../internals/Field';
import { ComposerContext } from '../components/Fields';

function defaultHandleValue(value) {
  return value;
}

export function useField(composer, name, validate, { handleValue = defaultHandleValue, serialize }, props) {

  const _composer = composer || useContext(ComposerContext);
  const forceUpdate = useForceUpdate();
  const field = useMemo(() => new Field(forceUpdate, _composer, name, validate, handleValue, serialize, props), []);

  useEffect(field.handleSubscriptions, []);
  
  return {
    name: field.name,
    value: field.value,
    error: field.error,
    dirty: field.dirty,
    touched: field.touched,
    onChange: field.handleChange,
    onBlur: field.handleBlur
  };
}