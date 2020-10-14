import React, { lazy, Suspense, useState } from 'react';
import ReactDOM from 'react-dom';
import styles1 from './styles1.css';

// function wait(ms) {
//   return new Promise(
//     resolve => {
//       setTimeout(
//         () => resolve(),
//         ms
//       );
//     }
//   );
// }

// const Comp1 = lazy(async () => {
//   await wait(2000);
//   return import('./Comp1');
// });

const Comp1 = lazy(() => import('./Comp1'));

// function aaa() {
//   const b = 5;
//   return 2;
// }

// aaa();

function App() {
  console.log('App');
  const a = 5;

  const [showComp1, setShowComp1] = useState(false);

  return <div className={styles1.root1}>
    Hello World!
    <div>
      <button onClick={() => setShowComp1(show => !show)}>show comp1</button>
    </div>
    <Suspense fallback={<div>loading ...</div>}>
      {showComp1 && <Comp1 />}
    </Suspense>
  </div>;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);