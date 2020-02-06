import React, {Component} from 'react';
import './BuyerRegistration.scss';
import {observer} from 'mobx-react';

import RegisterBuyerStore from '../../stores/RegisterBuyerStore';

@observer
class BuyerRegistration extends Component <{}, {name: string, email: string, password: string}> {
    store: RegisterBuyerStore = new RegisterBuyerStore();

    render(){
     return(
         <div className="buyerRegistration">
                <h4>Registration</h4>

                <form onSubmit={this.store.onSubmit} className="buyerRegistration-form">
                    <input
                        className="buyerRegistration-form__input"
                        type="text"
                        value={this.store.name}
                        onChange={this.store.onChangeName}
                        placeholder='name'
                    />

                    <input
                        className="buyerRegistration-form__input"
                        type="text"
                        value={this.store.email}
                        onChange={this.store.onChangeEmail}
                        placeholder='email'
                    />

                    <input
                        className="buyerRegistration-form__input"
                        type="text"
                        value={this.store.password}
                        onChange={this.store.onChangePassword}
                        placeholder='password'
                    />

                    <input type="submit" value="Sing up"/>
                </form>
         </div>
     );
    }
}

export default BuyerRegistration;
