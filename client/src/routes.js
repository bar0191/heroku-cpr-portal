import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import App from './App';
import Dashboard from './views/dashboard';
import Mail from './views/mail';
import Widgets from './views/widgets';

// ui elements
import Buttons from './views/ui/buttons';
import Typography from './views/ui/typography';
import Cards from './views/ui/cards';
import Modals from './views/ui/modals';
import Notification from './views/ui/notification';
import Extras from './views/ui/extras';

// forms
import FormGeneral from './views/forms/general';
import FormAdvanced from './views/forms/advanced';

// charts
import Charts from './views/charts';

// tables
import Tables from './views/tables';

// pages
import SignIn from './views/pages/signin';
import Register from './views/pages/register';
import ForgetPass from './views/pages/forget';
import Page404 from './views/pages/404';

export default (
    <Route>
        <Route component={App} path='/'>
            <IndexRoute component={Dashboard}/>
            <Route path='widgets' component={Widgets}/>
            <Route path='ui/buttons' component={Buttons}/>
            <Route path='ui/typography' component={Typography}/>
            <Route path='ui/cards' component={Cards}/>
            <Route path='ui/modals' component={Modals}/>
            <Route path='ui/notification' component={Notification}/>
            <Route path='ui/extras' component={Extras}/>
            <Route path='forms/general' component={FormGeneral}/>
            <Route path='forms/advanced' component={FormAdvanced}/>
            <Route path='charts' component={Charts}/>
            <Route path='tables' component={Tables}/>
        </Route>
        <Route component={Mail} path='mail'/>
        <Route component={SignIn} path='pages/signin'/>
        <Route component={Register} path='pages/register'/>
        <Route component={ForgetPass} path='pages/forget'/>
        <Route component={Page404} path='pages/404'/>
        {/* default */}
        <Route component={Page404} path='404'/>
        <Redirect from="*" to="404"/>
    </Route>
);
