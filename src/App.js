import React, {Component} from 'react';
import HomeDeliveryForm from './components/HomeDeliveryForm/index';
import CollectInStoreForm from './components/CollectInStoreForm/index';
import CreditCard from './components/CreditCard/index';
import SmsVerification from './components/SmsVerification/index';
import ShipingOptions from './components/ShipingOptions/index';
import httpClient from './services/index';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.shippingStore = 'orders/current/shipping-store';
    this.shippingAddress = 'orders/current/shipping-address';
    this.setCreditCard = 'orders/current/payment-card';
    this.changeCountryUrl = 'current-country';
    this.state = {
      isTokenActive: true,
      tokenOrGuestId: '',
    };
  }

  handleRadioButtonChange = (prop) => {
    return (event) => {
      this.setState({
        ...this.state,
        [prop]: event.target.value === 'true' ? true : false,
      });
    };
  };

  handleInputChange = (event) => {
    this.setState({
      ...this.state,
      tokenOrGuestId: event.target.value,
    });
  };

  handleSelectCreditCard = (creditCard) => {

    return async (event) => {
      const {isTokenActive, tokenOrGuestId} = this.state;
      const params = {
        method: 'PUT',
        body: JSON.stringify(creditCard),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      };
      const response = await httpClient.fetch(isTokenActive, tokenOrGuestId,
          this.setCreditCard, params);
      const data = await response.json();
    };

  };

  handleChangeCountryClick = () => {
    const params = {
      method: 'PUT',
      body: JSON.stringify({country: 'CN'}),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };

    const {isTokenActive, tokenOrGuestId} = this.state;

    return httpClient.fetchParams(isTokenActive, tokenOrGuestId,
        this.changeCountryUrl, '?country=CN&language=en', params).
        then(async (res) => {
          const currentResponse = await httpClient.fetch(isTokenActive,
              tokenOrGuestId, 'orders/current');
          const result = currentResponse.json();
        }).
        then().
        catch();
  };

  handleApplyDeliveryClick = async () => {
    const {isTokenActive, tokenOrGuestId} = this.state;
    if (this.state.deliveryType === 'HOME') {
      const homeFormState = this.refs.homeForm.state;
      const params = {
        method: 'PUT',
        body: JSON.stringify(homeFormState),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }),
      };
      this.setState({
        ...this.state,
        deliveryAddress: homeFormState,
      });
      const response = await httpClient.fetch(isTokenActive, tokenOrGuestId,
          this.shippingAddress, params);
      const result = await response.json();
    }
    if (this.state.deliveryType === 'STORE') {
      const data = {
        address: {...this.state.selectedStore.address},
        sap_store_id: this.state.selectedStore.sap_store_id,
        store_id: this.state.selectedStore.store_id,
      };
      this.setState({
        ...this.state,
        deliveryAddress: this.state.selectedStore.address,
      });
      const params = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }),
      };
      const response = await httpClient.fetch(isTokenActive, tokenOrGuestId,
          this.shippingStore, params);
      const result = await response.json();
    }
  };

  selectStoreHandler = (store) => {
    this.setState({
      ...this.state,
      selectedStore: store,
    });
  };
  selectShippingOption = (deliveryType) => {
    this.setState({
      ...this.state,
      deliveryType,
    });
  };

  submitOrder = async () => {
    const {isTokenActive, tokenOrGuestId} = this.state;
    const submitUrl = 'orders/current';
    const params = {
      method: 'POST',
      body: JSON.stringify({
        app: 'mobile',
        consents: [],
        cvv: '767',
        sandbox: true,
      }),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    };
    const response = await httpClient.fetchParams(isTokenActive, tokenOrGuestId,
        submitUrl, '?country=CN&language=en&action=submit', params);

    const result = await response.json();
    if(result.response) {
      this.setState({
          ...this.state,
        smsRedirectUrl: result.response.data.redirect_url
      })
    }
  };

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to stub page</h1>
          </header>

          <div className="container">

            <div className="wrapper">
              <form action="">
                  <label>Token:</label>
                  <input type="radio"
                         value={true}
                         onChange={this.handleRadioButtonChange('isTokenActive')}
                         checked={this.state.isTokenActive}/>
                  <label>GuestId:</label>
                  <input type="radio"
                         value={false}
                         onChange={this.handleRadioButtonChange('isTokenActive')}
                         checked={this.state.isTokenActive === false}/>
                <div>
                  <br/>
                <input type="text"
                       placeholder={this.state.isTokenActive ?
                           'Token' :
                           'GuestId'}
                       value={this.state.tokenOrGuestId}
                       onChange={this.handleInputChange}
                />
              </div>

              </form>



            </div>

            <div className="wrapper">
              <button onClick={this.handleChangeCountryClick}>Change Country
              </button>
            </div>

            <div className="wrapper">
              <div>
                <ShipingOptions isTokenActive={this.state.isTokenActive}
                                tokenOrGuestId={this.state.tokenOrGuestId}
                                selectShippingOption={this.selectShippingOption}/>

                <br/>

                {this.state.deliveryType === 'HOME' &&
                <HomeDeliveryForm ref="homeForm"/>}
                {this.state.deliveryType === 'STORE' && <CollectInStoreForm
                    selectStoreHandler={this.selectStoreHandler}/>}

                <button className="buttonSubmitDelivery"
                        onClick={this.handleApplyDeliveryClick}>Apply shipping
                </button>
              </div>
            </div>


            <div className="wrapper">
              <CreditCard isTokenActive={this.state.isTokenActive}
                          tokenOrGuestId={this.state.tokenOrGuestId}
                          selectCreditCard={this.handleSelectCreditCard}
                          deliveryAddress={this.state.deliveryAddress}
                          deliveryType={this.state.deliveryType}/>
            </div>

            <div className="wrapper">
              <button className="submitOrder"
                      onClick={this.submitOrder}>
                Submit
              </button>
            </div>

            <div className="wrapper">
              <SmsVerification redirectUrl={this.state.smsRedirectUrl}
                               isTokenActive={this.state.isTokenActive}
                               tokenOrGuestId={this.state.tokenOrGuestId}/>
            </div>

          </div>
        </div>
    );
  }
}

export default App;
