import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, useObservable } from '../../dist';

const observable1 = new Observable(0);
const observable2 = new Observable(1);

observable2.subscribe((newValue, oldValue) => {
  console.log('newValue:', newValue);
  console.log('oldValue:', oldValue);
});

function outerClick() {
  console.log('click outer');
  observable1.value++;
  observable2.value++;
}

function innerClick() {
  console.log('click inner');
  observable2.value++;
}

const outerClick1 = () => setTimeout(outerClick, 0);
const innerClick1 = () => setTimeout(innerClick, 0);

function App() {
  console.log('App');
  const ttt = useObservable(observable1);
  const lll = useObservable(observable2);

  return <div style={{ padding: '24px', backgroundColor: 'yellow', width: '96px' }} onClick={outerClick1} >
    <div style={{ padding: '12px', backgroundColor: 'red' }} onClick={innerClick1} >
      num1: {ttt}
      <br />
      num2: {lll}
    </div>
  </div>;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);