import { useEffect, useMemo, useReducer } from 'react';
const { unstable_batchedUpdates } = require('react-dom');

type UpdateFn = () => void;

let __updateQueue = new Set<UpdateFn>();

function _invokeUpdateQueue() {
  const updateQueue = __updateQueue;
  __updateQueue = new Set();
  for (const update of updateQueue) update();
}

function invokeUpdateQueue() {
  unstable_batchedUpdates(_invokeUpdateQueue);
}

function reducer(value: boolean) {
  return !value;
}

class Updater {
  batch = true;

  constructor(
    public updateFn: UpdateFn
  ) {
    this.invoke = this.invoke.bind(this);
  }

  invoke() {
    if (this.batch) {
      if (__updateQueue.size === 0) setTimeout(invokeUpdateQueue, 0);
      __updateQueue.add(this.updateFn);
    }
  }

  handleUnmount() {
    return () => __updateQueue.delete(this.updateFn);
  }

}

export function useUpdate(batch = true): UpdateFn {
  console.log('useUpdate');

  const updateFn = useReducer(reducer, false)[1];
  const updater = useMemo(() => new Updater(updateFn), []);
  updater.batch = batch;
  useEffect(updater.handleUnmount, []);
  return updater.invoke;
}