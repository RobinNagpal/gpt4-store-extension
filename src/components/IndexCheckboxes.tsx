// Create a react styled component which has three checkboxes
import React, { useState } from 'react';
import Checkbox from '@/components/Checkbox';

function IndexCheckboxes() {
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const updateIndexes = (index: string) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };
  return (
    <div>
      <div>
        <b>Indexes</b>
      </div>
      <Checkbox
        id="uniswap"
        checked={selectedIndexes.includes('uniswap')}
        onChange={() => updateIndexes('uniswap')}
        label={'Uniswap'}
      />
      <Checkbox
        id="compound"
        checked={selectedIndexes.includes('compound')}
        onChange={() => updateIndexes('compound')}
        label={'Compound'}
      />
      <Checkbox
        id="aave"
        checked={selectedIndexes.includes('aave')}
        onChange={() => updateIndexes('aave')}
        label={'AAVE'}
      />
    </div>
  );
}

export default IndexCheckboxes;
