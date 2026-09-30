import Checkbox from './ui/form/checkbox/Checkbox';
import React from 'react';

const MicroCheckbox = ({ row, field, component }: { row: any; field: any; component: any }) => {
  //   return <Checkbox checked={row[field]} {...component} />;
  const [checked, setChecked] = React.useState(row[field]);
  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return <Checkbox readOnly checked={checked} onChange={handleChange} {...component} />;
};

export default MicroCheckbox;
