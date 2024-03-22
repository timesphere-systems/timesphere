import React, { useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";
import styled from 'styled-components';

import ApproveIcon from '../assets/icons/Approve.svg';
import WaitingIcon from '../assets/icons/Waiting.svg';
import DenyIcon from '../assets/icons/Deny.svg';

const SelectorWrapper = styled.div`
    display: flex;
    gap: 10pt;
`;

const DropdownWrapper = styled.div`
    display: flex;
    gap: 10pt;
    position: relative;
    font-size: 15pt;
    width: fit-content;
`;

const Dropdown = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: fit-content;
`;

const DropdownButton = styled.div`
    padding: 8pt 10pt;
    background-color: white;
    border: 1pt solid #5f5883;
    border-radius: 9pt;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    gap: 50pt;
    position: relative;

    span {
        display: flex;
        align-items: center;
        color: grey;
        fill: grey;
        gap: 10pt;

        svg path {
            color: grey;
        }
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    width: calc(100% );
    padding: 5pt 0;
    background-color: white;
    top: calc(100% - 8pt);
    border-radius: 0 0 9pt 9pt;
    opacity: ${({ menuOpen }) => (menuOpen ? '1' : '0.2')};
    transform: ${({ menuOpen }) => (menuOpen ? 'scale(1)' : 'scale(0)')};
    transform-origin: top;
    border: 1pt solid #5f5883;
    border-top: none;
    z-index: 999;
    box-sizing: border-box;
`;


const MenuItem = styled.div`
    color: gray;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10pt;

    &:hover {
        background-color: #ddd;
    }

    &.active {
        color: black;
    }
`;

const Label = styled.p`
    margin: 0;
    padding-top: 9pt;
`;

function Selector() {
    const [sortBySelectedItem, setSortBySelectedItem] = useState('Latest');
    const [statusSelectedItem, setStatusSelectedItem] = useState('Select Status');
    const [sortByMenuOpen, setSortByMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);

    const toggleSortByMenu = () => {
        setSortByMenuOpen(!sortByMenuOpen);
        setStatusMenuOpen(false);
    };

    const toggleStatusMenu = () => {
        setStatusMenuOpen(!statusMenuOpen);
        setSortByMenuOpen(false);
    };

    const closeMenus = () => {
        setSortByMenuOpen(false);
        setStatusMenuOpen(false);
    };

    const handleSortByItemClick = (item) => {
        setSortBySelectedItem(item);
        closeMenus();
    };

    const handleStatusItemClick = (item) => {
        setStatusSelectedItem(item);
        closeMenus();
    };

    const statusIcons = {
        'Approved': ApproveIcon,
        'Waiting Approval': WaitingIcon,
        'Denied': DenyIcon
    };

    return (
        <SelectorWrapper>
            <DropdownMenuComponent label='Sort By:' items={['Latest', 'Oldest']} selectedItem={sortBySelectedItem} handleItemClick={handleSortByItemClick} menuOpen={sortByMenuOpen} toggleMenu={toggleSortByMenu} />
            <DropdownMenuComponent label='Status:' items={['Approved', 'Waiting Approval', 'Denied']} selectedItem={statusSelectedItem} handleItemClick={handleStatusItemClick} menuOpen={statusMenuOpen} toggleMenu={toggleStatusMenu} icons={statusIcons} />
        </SelectorWrapper>
    );
}

function DropdownMenuComponent({ label, items, selectedItem, handleItemClick, menuOpen, toggleMenu, icons }) {
    return (
        <DropdownWrapper>
            <Label>{label}</Label>
            <Dropdown>
                <DropdownButton onClick={toggleMenu}>
                    <span id='selected-item'>
                        {icons && icons[selectedItem] && <img src={icons[selectedItem]} alt={selectedItem} />} {/* Render icon if available */}
                        {selectedItem === 'Select Status' ? 'Select Status' : selectedItem}
                    </span>
                    <span id='down-arrow'><RiArrowDropDownLine /></span>
                </DropdownButton>

                <DropdownMenu menuOpen={menuOpen}>
                    {items.map((item) => (
                        <MenuItem key={item} className={selectedItem === item ? 'active' : ''} onClick={() => handleItemClick(item)}>
                            {icons && icons[item] && <img src={icons[item]} alt={item} />} {/* Render icon if available */}
                            {item}
                        </MenuItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            
        </DropdownWrapper>
    );
}

export default Selector;