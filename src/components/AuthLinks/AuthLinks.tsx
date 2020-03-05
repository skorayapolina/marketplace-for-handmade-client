import "./AuthLinks.scss"
import React, {Component} from 'react';
import {ROUTES} from "../../routes/routes";
import {NavLink} from 'react-router-dom';

import {FormattedMessage} from 'react-intl';

class AuthLinks extends Component {

    render(){

        return(
            <div className="links">
                <NavLink to={ROUTES.buyers.login} className="auth-link">
                    <FormattedMessage id="signIn"/>
                </NavLink>

                <NavLink to={ROUTES.buyers.registration} className="auth-link">
                    <FormattedMessage id="register"/>
                </NavLink>
            </div>
        )
    }
}

export default AuthLinks;