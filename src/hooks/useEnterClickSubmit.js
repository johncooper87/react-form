import { useContext } from 'react';
import { ComposerContext } from '../components/Fields';

export function useEnterClickSubmit(comp) {
  const _comp = comp || useContext(ComposerContext);
  return _comp.submitOnEnterClick;
}