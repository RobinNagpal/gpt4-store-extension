import React from 'react';
import styled from 'styled-components';

const Dropdown = styled.select`
  border: none;
  margin: 16px;
  font-size: 16px;
  display: inline-block;
`;

function IndexDropdown() {
  return (
    <div>
      <div>
        <b>Index Dropdown</b>
      </div>
      <Dropdown>
        <option value="1">Select Index</option>
        <option value="1">Uniswap</option>
        <option value="2">Aave</option>
      </Dropdown>
    </div>
  );
}

export default IndexDropdown;
