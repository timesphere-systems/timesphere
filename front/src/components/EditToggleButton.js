import React from 'react';
import styled from 'styled-components';

// hide default html checkbox
const INPUT = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`

// box around slider
const SWITCH = styled.label`
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
`


const SLIDER = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 30px;

    &::before {
        position: absolute;
        content: "";
        height: 1.4em;
        width: 1.4em;
        border-radius: 20px;
        left: 0.3em;
        bottom: 0.3em;
        background-color: white;
        transition: .4s;
    }
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
