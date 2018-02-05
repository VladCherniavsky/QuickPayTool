import React from 'react';
import './style.css';

export default class SmsVerification extends React.Component {
  constructor(props) {
    super(props);
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
        sms_confirmation_code: this.state.smsCode,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
    };
    const response = await fetch(redirectUrl, params);
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