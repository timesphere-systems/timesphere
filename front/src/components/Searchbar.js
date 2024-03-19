import React from 'react'
import styled from 'styled-components';

const BAR = styled.div`
    display: flex;
    height: 3.125rem;
    padding: 0rem 1.4375rem;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;

    border-radius: 0.5625rem;
    border: 2px solid #605984;
    background: #FFF;
`

const TEXT = styled.p`
    color: rgba(0, 0, 0, 0.39);
    font-family: Inter;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
const SEARCH = styled.div`
    display: flex;
    padding: 1rem;
    align-items: flex-start;
    gap: 0.625rem;
`

const PIC = styled.div`
    width: 0.875rem;
    height: 0.875rem;
    transform: rotate(-90deg);
`


const Searchbar = () => {
    return(
        <BAR>
            <TEXT>Search Employee</TEXT>
            <SEARCH>
                <PIC>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.72724 1.5C5.5945 1.5 4.4872 1.8359 3.54536 2.46521C2.60352 3.09453 1.86944 3.989 1.43596 5.03552C1.00248 6.08204 0.889063 7.23359 1.11005 8.34457C1.33104 9.45554 1.8765 10.476 2.67747 11.277C3.47844 12.078 4.49894 12.6234 5.60991 12.8444C6.72089 13.0654 7.87244 12.952 8.91896 12.5185C9.96548 12.085 10.8599 11.351 11.4893 10.4091C12.1186 9.46728 12.4545 8.35998 12.4545 7.22724C12.4544 5.70831 11.8509 4.25162 10.7769 3.17758C9.70286 2.10353 8.24617 1.5001 6.72724 1.5Z" stroke="#1B143E" stroke-width="2" stroke-miterlimit="10"/>
                        <path d="M11 11.5001L14.9998 15.5" stroke="#1B143E" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
                    </svg>
                </PIC>
            </SEARCH>
        </BAR>
    )
}


export default Searchbar;