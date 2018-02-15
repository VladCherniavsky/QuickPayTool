import React from 'react';
import CreditCardList from '../CreditCardList/index';
import CredirCardForm from '../NewCreditCardForm/index';

export default class CreditCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTokenActive: props.isTokenActive,
      tokenOrGuestId: props.tokenOrGuestId,
      creditCards: [],
      showNewCreditCardForm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      isTokenActive: nextProps.isTokenActive,
      tokenOrGuestId: nextProps.tokenOrGuestId,
    });
  }

  getSavedCards = async () => {
    const url = `https://preprod-api.apps.burberry.com/v1/ecom-env-proxy/qa4/users/me/payment-cards?country=CN&language=en&token=${this.state.tokenOrGuestId}`;
    const response = await fetch(url);
    const result = await response.json();
    const creditCards = result.response && result.response.data;

    creditCards && this.setState({...this.state, creditCards});
  };

  renderShowSavedCardsButton = () => {
    if (this.state.isTokenActive && this.state.tokenOrGuestId) {
      return <button onClick={this.getSavedCards}>Show saved cards</button>;
    }
    return null;
  };
  handleShowHideNewCardForm = () => {
    this.setState({
      ...this.state,
      showNewCreditCardForm: !this.state.showNewCreditCardForm,
    });
  };

  render() {
    return (
        <div>
          <h3>Credit Card</h3>

          {this.renderShowSavedCardsButton()}
          {(this.state.isTokenActive && this.state.creditCards.length > 0)
          && <CreditCardList selectCreditCard={this.props.selectCreditCard}
                             creditCards={this.state.creditCards}/>}
          <button onClick={this.handleShowHideNewCardForm}>
            {this.state.showNewCreditCardForm ? 'Hide form' : 'Add new card'}
          </button>

          {
            this.state.showNewCreditCardForm &&
            <CredirCardForm deliveryAddress={this.props.deliveryAddress}
                            isTokenActive={this.state.isTokenActive}
                            tokenOrGuestId={this.state.tokenOrGuestId}
                            deliveryType={this.props.deliveryType} ref={'newCredirCard'}/>
          }
        </div>
    );

  }
}