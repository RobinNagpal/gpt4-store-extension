import { css } from 'glamor';
import React from 'react';

const dropdownClass = css({
  border: 'none',
  margin: '16px',
  fontSize: '16px',
  display: 'inline-block',
});

function IndexDropdown() {
  return (
    <div className={dropdownClass.toString()}>
      <div>
        <b>Index Dropdown</b>
      </div>
      <select>
        <option value="1">Select Index</option>
        <option value="1">Uniswap</option>
        <option value="2">Aave</option>
      </select>
    </div>
  );
}

export default IndexDropdown;
