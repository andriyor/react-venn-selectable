import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Venn} from '../dist';
import {VennSet} from "../types/venn.js";

const App = () => {
  const sets3: VennSet[] = [
    {"sets": ["A"], "size": 12, "label": "A"},
    {"sets": ["B"], "size": 12, "label": "B"},
    {"sets": ["C"], "size": 12, "label": "C"},
    {"sets": ["A", "B"], "size": 2},
    {"sets": ["A", "C"], "size": 2},
    {"sets": ["B", "C"], "size": 2},
    {"sets": ["A", "B", "C"], "size": 2}
  ];

  const sets2: VennSet[] = [
    {"sets": ["A"], "size": 12, "label": "A"},
    {"sets": ["B"], "size": 12, "label": "B"},
    {"sets": ['A', "B"], "size": 2},
  ];

  const selectors2: string[] = ['(A∩B)'];

  return (
    <div>
      <Venn sets={sets2} selectors={selectors2}/>
      <Venn sets={sets3}/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
