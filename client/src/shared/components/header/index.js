import React from 'react';
import screenfull from 'screenfull';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Button, Progress
} from 'reactstrap';

// icons
import IconFullScreen from 'react-icons/lib/md/crop-free';
import IconSearch from 'react-icons/lib/md/search';
import IconFace from 'react-icons/lib/md/face';
import IconSecurity from 'react-icons/lib/md/security';
import IconHelp from 'react-icons/lib/md/help';
import IconLogout from 'react-icons/lib/md/power-settings-new';
import IconMenu from 'react-icons/lib/md/menu';

// style
import './style.scss';

export default (props) => (
    <header className="site-head d-flex align-items-center justify-content-between">
        <div className="wrap mr-4">
            <IconMenu size="28" color="#fff" onClick={props.toggleNav} style={{cursor: 'pointer'}}/>
        </div>
        <div className="wrap mr-4">
            <p className="mb-0 subtitle text-nowrap text-white">Texas Health Presbyterian Hospital - CPR Statistics Portal</p>
        </div>
        <div className="right-elems ml-auto d-flex">
            <div className="wrap hidden-sm-down">
                <IconFullScreen size="28" color="#fff" onClick={() => screenfull.toggle()}/>
            </div>
          {/*  <div className="wrap profile">
                <UncontrolledDropdown>
                    <DropdownToggle tag="div">
                        <img src="http://i.imgur.com/0rVeh4A.jpg" alt="avatar"/>
                    </DropdownToggle>
                    <DropdownMenu right style={{minWidth: '12rem'}}>
                        <DropdownItem header>Balance: $993.4</DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem><IconFace size="16"/>&emsp;<a href="#">Profile</a></DropdownItem>
                        <DropdownItem><IconMail size="16"/>&emsp;<a href="#">Inbox</a></DropdownItem>
                        <DropdownItem><IconSecurity size="16"/>&emsp;<a href="#">Security</a></DropdownItem>
                        <DropdownItem><IconHelp size="16"/>&emsp;<a href="#">Help</a></DropdownItem>
                        <div className="text-right ml-3 mr-3 mt-2"><Button block color="success" size="sm"><IconLogout size="15"/>&emsp;Logout</Button></div>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div> */}
        </div>
    </header>
);
