import React from 'react';
import './style.css';
import httpClient from '../../services/index';

export default class NewCreditCardForm extends React.Component {
    constructor(props) {
        super(props);
        this.tokenizeUrl = 'https://api.paymentsos.com/tokens';
        this.paymentCardUrl = 'orders/current/payment-cards';
        this.state = {
            expiration_month: '',
            expiration_year: '',
            number: '',
            cvv: '',
            holderName: '',
            account_type: 'credit',
            phone: '123456789',
            first_name: '',
            last_name: '',
            save_this_card_for_future_use: 'true'
        };
    }

    handleInputChange = (inputField) => {
        return (event) => {
            this.setState({
                ...this.state,
                [inputField]: event.target.value,
            });
        };
    };

    hadnleRadioChange = (field) => {
        return (event) => {
            this.setState({
                ...this.state,
                [field]: event.target.value
            });
        };

    };


    sumbitCard = async () => {
        const tokenData = await this._tokenize();
        let {first_name, last_name} = this.props.deliveryAddress;
        if (!first_name) {
            first_name = this.state.first_name;
        }
        if (!last_name) {
            last_name = this.state.last_name;
        }

        const data = {
            address: {
                first_name,
                last_name,
                phone: this.state.phone,
            },
            type: 'cupExpress',
            number: this.state.number.split('').reverse().filter((value, index) => index < 4).reverse().join(''),
            save_this_card_for_future_use: this.state.save_this_card_for_future_use,
            account_type: this.state.account_type,
            payment_method_token: tokenData.token,
        };


        if (this.state.account_type === 'debit') {
            delete data.expiration_month;
            delete data.expiration_year;
        } else {
            data.expiration_month = this.state.expiration_month;
            data.expiration_year = this.state.expiration_year
        }

        const addedCard = await this._addCard(data);
    };

    _tokenize = async () => {
        let {first_name, last_name} = this.props.deliveryAddress;
        const data = {
            holder_name: this.state.holderName,
            card_number: this.state.number,
            token_type: 'credit_card',
            billing_address: {
                phone: this.state.phone,
            }
        };

        if (this.state.account_type === 'debit') {
            delete data.cvv;
        } else {
            data.expiration_date = `${this.state.expiration_month}/${this.state.expiration_year}`;
            data.cvv = this.state.cvv;
        }
        const params = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'api-version': '1.1.0',
                'x-payments-os-env': 'test',
                'public_key': '6a756fca-4f0f-4182-962a-1080838059b5',
                'x-client-user-agent': '',
                'x-client-ip-address': '',
                'Accept': 'application/json',
            },

        };
        const response = await fetch(this.tokenizeUrl, params);
        return await response.json();

    };

    _addCard = async (data) => {
        const {isTokenActive, tokenOrGuestId} = this.props;
        const params = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };

        const response = await httpClient.fetch(isTokenActive, tokenOrGuestId,
            this.paymentCardUrl, params);
        return await response.json();
    };

    render() {
        return (
            <div>
                <form className="creditCardForm">
                    <div className="radiogroup">
                        <label>Credit:</label>
                        <input type="radio"
                               onChange={this.hadnleRadioChange('account_type')}
                               value='credit'
                               checked={'credit' === this.state.account_type}/>
                        <label>Debit:</label>
                        <input type="radio"
                               onChange={this.hadnleRadioChange('account_type')}
                               value='debit'
                               checked={'debit' === this.state.account_type}/>
                    </div>
                    <div className="element">
                        <label>Number: </label>
                        <input type="text"
                               onChange={this.handleInputChange('number')}
                               value={this.state.number}/>
                    </div>
                    <div className="element">
                        <label>Name: </label>
                        <input type="text"
                               onChange={this.handleInputChange('holderName')}
                               value={this.state.holderName}/>
                    </div>
                    {
                        this.state.account_type === 'credit' && <div>
                            <div className="element">
                                <label>Expiration Month: </label>
                                <input type="text"
                                       onChange={this.handleInputChange('expiration_month')}
                                       value={this.state.expiration_month}/>
                            </div>
                            <div className="element">
                                <label>Expiration Year: </label>
                                <input type="text"
                                       onChange={this.handleInputChange('expiration_year')}
                                       value={this.state.expiration_year}/>
                            </div>

                            <div className="element">
                                <label>CVV: </label>
                                <input type="text"
                                       onChange={this.handleInputChange('cvv')}
                                       value={this.state.cvv}/>
                            </div>
                        </div>

                    }

                    <div className="element">
                        <label>Phone: </label>
                        <input type="text"
                               onChange={this.handleInputChange('phone')}
                               value={this.state.phone}/>
                    </div>
                    {
                        this.props.deliveryType === 'STORE' &&
                        <div className="element">
                            <label>First Name: </label>
                            <input type="text"
                                   onChange={this.handleInputChange('first_name')}
                                   value={this.state.first_name}/>
                        </div>
                    }

                    {
                        this.props.deliveryType === 'STORE' &&
                        <div className="element">
                            <label>Last Name: </label>
                            <input type="text"
                                   onChange={this.handleInputChange('last_name')}
                                   value={this.state.last_name}/>
                        </div>
                    }
                    <br/>
                    <div className="radiogroup">
                        <span>Save for future use ???</span>
                        <br/>
                        <label>Yes:</label>
                        <input type="radio"
                               onChange={this.hadnleRadioChange('save_this_card_for_future_use')}
                               value="true"
                               checked={'true' === this.state.save_this_card_for_future_use}/>
                        <label>No:</label>
                        <input type="radio"
                               onChange={this.hadnleRadioChange('save_this_card_for_future_use')}
                               value="false"
                               checked={'false' === this.state.save_this_card_for_future_use}/>
                    </div>
                </form>
                <button className="buttonSubmitDelivery" onClick={this.sumbitCard}>
                    Submit new card
                </button>
            </div>

        );
    }
}