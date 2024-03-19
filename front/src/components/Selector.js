import React, { useState } from 'react';
import { ChevronDownOutline } from 'react-ionicons';
import './Selector.css';

import ApproveIcon from '../assets/icons/Approve.svg';
import WaitingIcon from '../assets/icons/Waiting.svg';
import DenyIcon from '../assets/icons/Deny.svg';

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
        <div className='selector'>
            <DropdownMenu label='Sort By:' items={['Latest', 'Oldest']} selectedItem={sortBySelectedItem} handleItemClick={handleSortByItemClick} menuOpen={sortByMenuOpen} toggleMenu={toggleSortByMenu} />
            <DropdownMenu label='Status:' items={['Approved', 'Waiting Approval', 'Denied']} selectedItem={statusSelectedItem} handleItemClick={handleStatusItemClick} menuOpen={statusMenuOpen} toggleMenu={toggleStatusMenu} icons={statusIcons} />
        </div>
    );
}

function DropdownMenu({ label, items, selectedItem, handleItemClick, menuOpen, toggleMenu, icons }) {
    return (
        <div className='dropdown-wrapper'>
            <p className='label'>{label}</p>
            <div className='dropdown-bttn' onClick={toggleMenu}>
                <span id='selected-item'>
                    {icons && icons[selectedItem] && <img src={icons[selectedItem]} alt={selectedItem} />} {/* Render icon if available */}
                    {selectedItem === 'Select Status' ? 'Select Status' : selectedItem}
                </span>
                <span id='down-arrow'><ChevronDownOutline/></span>
            </div>

            <div className={`dropdown-menu ${menuOpen ? 'open' : 'close'}`}>
                {items.map((item) => (
                    <div key={item} className={`item ${selectedItem === item ? 'active' : ''}`} onClick={() => handleItemClick(item)}>
                        {icons && icons[item] && <img src={icons[item]} alt={item} />} {/* Render icon if available */}
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Selector;