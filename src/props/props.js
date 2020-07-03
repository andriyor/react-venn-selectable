/*
AUTO-GENERATED EDIT AT YOUR OWN PERIL:
These propTypes were auto-generated from the TypeScript definitions in: ../../Venn.tsx
*/

import PropTypes from 'prop-types';

export const propTypes = {
  selectors: PropTypes.arrayOf(PropTypes.string),
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      sets: PropTypes.arrayOf(PropTypes.string).isRequired,
      size: PropTypes.number.isRequired,
    })
  ),
};
