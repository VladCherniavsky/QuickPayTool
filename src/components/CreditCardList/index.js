import React from "react";
import "./style.css";

const creditCardList = ({ creditCards, selectCreditCard, removeCard }) => {
  return (
    <div className="creditCardsList">
      {creditCards.map((creditCard, index) => (
        <div key={creditCard.number + index}>
          <div className="creditCard">
            <div>{creditCard.type}</div>
            <div>XXXX-XXXX-XXXX-{creditCard.number}</div>
            <div>
              Expires: {creditCard.expiration_month}/{
                creditCard.expiration_year
              }
            </div>
          </div>
          <div className="btn-group">
            <button
              className="btn-select"
              onClick={selectCreditCard(creditCard)}
              key={creditCard.expiration_month + 'bb'}>
              Select
            </button>
            <button  className="btn-remove"
                     onClick={removeCard(creditCard)}
                     key={creditCard.expiration_month + 'a1'}>Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default creditCardList;
