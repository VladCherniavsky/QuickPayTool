import React from 'react';
import httpClient from '../../services/index';
import './style.css';

export default class SmsVerification extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChangeSelect = (event) => {
    this.props.selectLanguage(event.target.value)
  };

  render() {
    return (
      <div>
        <h3>Current language: {this.props.currentLanguage}</h3>
        <select onChange={this.handleChangeSelect}>
          {this.props.languages.map((lang) => (
            <option value={lang}
                    key={lang}>{lang}</option>
          ))}
        </select>
      </div>
    )
  }
}
