import React from 'react';
import styled from 'styled-components';

const INPUT = styled.input`

`

const SWITCH = styled.label`
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
    border: 1px solid black;
`

const SLIDER = styled.span`
`

const EditToggleButton = () => {

  return (
    <div>
        <SWITCH>
            <INPUT type="checkbox"/>
            <SLIDER></SLIDER>
        </SWITCH>
    </div>
  );
};

export default EditToggleButton;
