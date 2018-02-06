import React from 'react';
import httpClient from '../../services/index';
import './style.css';

export default class SmsVerification extends React.Component {
  constructor(props) {
    super(props);
    this.url = 'orders/current/payment-confirm';
    this.state = {
      smsCode: '',
    };
  }

  handleChangeInput = (event) => {
    this.setState({
      ...this.state,
      smsCode: event.target.value,
    });
  };

  onSubmit = async () => {
    const {redirectUrl} = this.props;
    const params = {
      method: 'POST',
      body: JSON.stringify({
        confirmation_code: this.state.smsCode,
        callback_url: redirectUrl
      }),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };

    const {isTokenActive, tokenOrGuestId} = this.props;
    const response = await httpClient.fetch(isTokenActive, tokenOrGuestId, this.url, params);
    const result = await response.json();
  };

  render() {

    return (
        <div>
          <h3>SMS verification</h3>
          <div className="element">
            <label htmlFor="">Sms code: </label>
            <input type="text" value={this.state.smsCode}
                   onChange={this.handleChangeInput}/>
          </div>

          <button className="buttonSubmitDelivery" onClick={this.onSubmit}>
            Submit sms code
          </button>
        </div>
    );
  }
}