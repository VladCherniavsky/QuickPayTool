import React from 'react';
import './style.css';

const creditCardList = ({creditCards, selectCreditCard}) => {
  return (
      <div className="creditCardsList">
        {
          creditCards.map((creditCard, index) => (
              <div key={creditCard.number}>
                <div className="creditCard">
                  <div>{creditCard.type}</div>
                  <div>XXXX-XXXX-XXXX-{creditCard.number}</div>
                  <div>
                    Expires: {creditCard.expiration_month}/{creditCard.expiration_year}</div>
                </div>
                <button onClick={selectCreditCard(creditCard)}
                        key={creditCard.expiration_month}>Select
                </button>
              </div>
          ))
        }

      </div>
  );
};

export default creditCardList;