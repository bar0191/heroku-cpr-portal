import React from 'react';
import ViewHeader from './view-header';
import ViewContent from './view-content';

// styling
import './style.scss';


export default () => (
    <div className="view">
        <ViewHeader/>
        <ViewContent/>
    </div>
);
