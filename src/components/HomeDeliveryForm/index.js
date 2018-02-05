import React from 'react';
import './style.css';

const mapPropToName = {
  country: 'Country',
  title: 'Title',
  first_name: 'First Name',
  last_name: 'Last Name',
  phone: 'Phone',
  line1: 'Address line 1',
  line2: 'Address line 2',
  line3: 'Address line 2',
  city: 'City',
  state: 'Region',
  postcode: 'Postcode',
};

export default class HomeDeliveryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: 'AA',
      country: 'CN',
      first_name: 'AA',
      last_name: 'AA',
      line1: 'AA',
      line2: 'AA',
      line3: 'ddddd',
      phone: '123456789',
      postcode: '100000',
      state: 'Avon',
      title: 'Mr',
    };
  }

  onInputChange = (key) => {
    return (event) => {
      this.setState({
        ...this.state,
        [key]: event.target.value,
      });
    };
  };

  renderElements = (keys) => {
    return keys.map((key, index) => (
        <div className="element" key={key + index}>
          <label>{mapPropToName[key]}:</label>
          <input type="text" onChange={this.onInputChange(key)}
                 value={this.state[key]}/>
        </div>
    ));
  };

  render() {
    return (
        <form className="collectInStoreForm">
          {this.renderElements(Object.keys(this.state))}
        </form>
    );
  }
}