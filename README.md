# react-venn-selectable

[![version][version-badge]][package]

React venn.js wrapper 

## Installation

`npm i react-venn-selectable`

## Usage 

See `example` folder

```javascript
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
```

![](https://user-images.githubusercontent.com/11459840/86365898-ce3b8900-bc82-11ea-8c18-6062cae937f5.png)

[version-badge]: https://img.shields.io/npm/v/react-venn-selectable.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-venn-selectable
