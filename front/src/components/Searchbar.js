import React from 'react'
import styled from 'styled-components';
import SearchIcon from '../assets/icons/SearchIcon.svg';

const BAR = styled.div`
    display: flex;
    height: 50px;
    padding: 0px 23px;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    
    border-radius: 9px;
    border: 2px solid #605984;
    background: #FFF;
`

const TEXT = styled.p`
    color: rgba(0, 0, 0, 0.39);
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
const SEARCH = styled.div`
    display: flex;
    padding: 16px;
    align-items: flex-start;
    gap: 10px;
`

const PIC = styled.div`
    width: 14px;
    height: 14px;
    transform: rotate(-90deg);
`


const Searchbar = () => {
    return(
        <BAR>
            <form id="searchEmployeesForm" name="searchEmployeesForm">
                <TEXT>
                    <input type="text" name="searchEmployee" id="searchEmployee" placeholder="Search Employee" />
                </TEXT>
                <SEARCH>
                    <PIC>
                        <input type="image" src={SearchIcon} alt="Submit"/>
                    </PIC>
                </SEARCH>
            </form>
        </BAR>

    )
}


export default Searchbar;