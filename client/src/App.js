import React from 'react';
import Nav from './shared/components/nav';
import SiteHead from './shared/components/header';

import './app.scss';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navMini: true}
    }

    toggleNav = (e) => {
        e.preventDefault();
        this.setState({navMini: !this.state.navMini});
    }
    hideNav = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({navMini: false})
    }
    render() {
        let navMini = this.state.navMini;
        return (
            <div className="app-wrapper">
                <Nav mini={navMini} toggleNav={this.toggleNav}/>
                <div className={`content-container ${navMini ? 'full' : ''}`}>
                    {/* dropshadow for mobile nav triggering */}
                    <div className="menu-dropshadow" style={{display: (navMini ? 'block': 'none')}} onClick={this.hideNav}></div>
                    <SiteHead toggleNav={this.toggleNav}/>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
