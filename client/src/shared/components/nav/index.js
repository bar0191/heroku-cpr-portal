import React from 'react';
import {Link, IndexLink} from 'react-router';
import {Collapse} from 'reactstrap';


// icons
import IconDashboard from 'react-icons/lib/md/dashboard';
import IconUI from 'react-icons/lib/md/gradient';
import IconPages from 'react-icons/lib/md/filter-none';
import IconChart from 'react-icons/lib/md/landscape';
import IconTable from 'react-icons/lib/md/grid-on';
import IconForm from 'react-icons/lib/md/layers';
import IconDown from 'react-icons/lib/md/chevron-right';
import ScrollArea from 'react-scrollbar';

import './style.scss';
import IconFaHeartbeat from 'react-icons/lib/fa/heartbeat';

const NavHead = (props) => (
    <header className="nav-head">
        <Link to="/#">
            <strong className="h4 text-uppercase"><IconFaHeartbeat size="40"
               className="mr-3 text-primary"/>Menu</strong>
        </Link>
        <div className={`toggle-dot ${props.mini ? 'active': ''}`} onClick={props.toggleNav}></div>
    </header>
);

class NavList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }
    handleClick = (index, e) => {
        let c = e.currentTarget.className;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            selected: (c.indexOf('selected') >= 0) ? '' : index
        })
    }
    handleOpen = (index, e) => {
        e.stopPropagation();
        this.setState({
            selected: index
        })
    }


    render() {
        return <ScrollArea className="nav-list-container" horizontal={false} verticalScrollbarStyle={{width: '4px', marginLeft: '10px'}}>
            <ul className="list-unstyled nav-list clearfix">
                <li><div className="nav-list-title">Views</div></li>
                <li onClick={this.handleClick.bind(this, 0)} className={(this.state.selected === 0) ? 'selected': ''}>
                    <IndexLink to="/" activeClassName="active">
                        <IconDashboard size="18" color="#2962FF" className="icon-dashboard"/>
                        <span className="name">Dashboard</span>
                    </IndexLink>
                </li>

                {/*<li onClick={this.handleClick.bind(this, 1)} className={(this.state.selected === 1) ? 'selected': ''}>
                    <Link to="/mail" activeClassName="active">
                        <IconMail size="18" color="#00E676"/>
                        <span className="name">Mail</span>
                    </Link>
                </li>
                <li onClick={this.handleClick.bind(this, 2)} className={(this.state.selected === 2) ? 'selected': ''}>
                    <Link to="/widgets" activeClassName="active">
                        <IconWidgets size="18" color="#7C4DFF"/>
                        <span className="name">Widgets</span>
                        &emsp;<span className="badge text-uppercase" style={{'background': '#7C4DFF'}}>10</span>
                    </Link>
                </li>*/}
                <li><div className="nav-list-title">Components</div></li>
                <li onClick={this.handleClick.bind(this, 3)} className={(this.state.selected === 3) ? 'selected': ''}>
                    <Link to="">
                        <IconUI size="18"/>
                        <span className="name">Elements</span>
                        <IconDown size="14" className="icon-down"/>
                    </Link>
                    <Collapse isOpen={this.state.selected === 3 ? true: false} onClick={this.handleOpen.bind(this, 3)}>
                        <ul className="inner-drop list-unstyled">
                            <li><Link to="/ui/buttons" activeClassName="active">Buttons</Link></li>
                            <li><Link to="/ui/typography" activeClassName="active">Typography</Link></li>
                            <li><Link to="/ui/cards" activeClassName="active">Cards</Link></li>
                            <li><Link to="/ui/modals" activeClassName="active">Modals</Link></li>
                            <li><Link to="/ui/notification" activeClassName="active">Notification</Link></li>
                            <li><Link to="/ui/extras" activeClassName="active">Extras</Link></li>
                        </ul>
                    </Collapse>
                </li>
                <li onClick={this.handleClick.bind(this, 4)} className={(this.state.selected === 4) ? 'selected': ''}>
                    <Link to="">
                        <IconForm size="18"/>
                        <span className="name">Forms</span>
                        <IconDown size="14" className="icon-down"/>
                    </Link>
                    <Collapse isOpen={(this.state.selected === 4) ? true : false} onClick={this.handleOpen.bind(this, 4)}>
                        <ul className="inner-drop list-unstyled">
                            <li><Link to="/forms/general" activeClassName="active">General</Link></li>
                            <li><Link to="/forms/advanced" activeClassName="active">Advanced</Link></li>
                        </ul>
                    </Collapse>
                </li>
                <li onClick={this.handleClick.bind(this, 5)} className={(this.state.selected === 5) ? 'selected': ''}>
                    <Link to="/charts" activeClassName="active">
                        <IconChart size="18"/>
                        <span className="name">Charts</span>
                        &emsp;<span className="badge badge-primary badge-chart text-uppercase">mixed</span>
                    </Link>
                </li>
                <li onClick={this.handleClick.bind(this, 6)} className={(this.state.selected === 6) ? 'selected': ''}>
                    <Link to="/tables" activeClassName="active">
                        <IconTable size="18"/><span className="name">Tables</span>
                    </Link>
                </li>
                <li onClick={this.handleClick.bind(this, 7)} className={(this.state.selected === 7) ? 'selected': ''}>
                    <Link to="">
                        <IconPages size="18"/>
                        <span className="name">Pages</span>
                        <IconDown size="14" className="icon-down"/>
                    </Link>
                    <Collapse isOpen={(this.state.selected === 7) ? true : false} onClick={this.handleOpen.bind(this, 7)}>
                        <ul className="inner-drop list-unstyled">
                            <li><Link to="/pages/signin" activeClassName="active">Sign In</Link></li>
                            <li><Link to="/pages/register" activeClassName="active">Register</Link></li>
                            <li><Link to="/pages/forget" activeClassName="active">Forget Pass</Link></li>
                            <li><Link to="/pages/404" activeClassName="active">404</Link></li>
                        </ul>
                    </Collapse>
                </li>
            </ul>
            {/* end scroll-area */}
        </ScrollArea>
    }
}




export default (props) => (
    <nav className={`site-nav ${props.mini ? 'mini' : ''}`} role="navigation">
        <NavHead {...props}/>
        <NavList/>

    </nav>
);
