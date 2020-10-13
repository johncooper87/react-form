import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { FieldArray } from '../internals/FieldArray';
import { ComposerContext } from '../components/Fields';

export function useFieldArray(composer, name, validate, validateElement) {

  const _composer = composer || useContext(ComposerContext);
  const forceUpdate = useForceUpdate();
  const fieldArray = useMemo(() => new FieldArray(forceUpdate, _composer, name, validate, validateElement), []);

  useEffect(fieldArray.handleSubscriptions, []);

  return [
    fieldArray.elements,
    {
      map: fieldArray.map,
      push: fieldArray.push,
      error: fieldArray.error,
      dirty: fieldArray.dirty,
      touched: fieldArray.touched,
      onBlur: fieldArray.handleBlur
    }
  ];
}
