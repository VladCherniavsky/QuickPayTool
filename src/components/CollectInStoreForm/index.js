import React from 'react';
import './style.css';

export default class CollectInStoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      selectedStoreName: '',
      store_id: '',
      sap_store_id: '',
      address: {},

    };
  }

  componentDidMount() {
    fetch(
        'https://qa-api.apps.burberry.com/v2/stores?country=CN&language=en&limit=555').
        then(response => response.json()).
        then(result => {
          this.setState({
            ...this.state,
            stores: result.data.slice(result.data.length - 5),
          });
        });
  }

  onClickHandler = (store) => {
    return () => {
      this.setState({
        ...this.state,
        selectedStoreName: store.name,
        store_id: store.external_id,
        sap_store_id: store.external_id,
        address: store.address,
      }, (state) => {
        this.props.selectStoreHandler(this.state);
      });
    };
  };

  renderStore = (store) => (
      <li key={store.id} className="item">
        <button onClick={this.onClickHandler(store)}
                className="buttonSelectStore"
                disabled={store.external_id === this.state.store_id}>
          {store.name}
        </button>
      </li>
  );

  render() {
    return (
        <div className="storeList">
          <p>{this.state.selectedStoreName &&
          `Selected store is ${this.state.selectedStoreName}`}</p>

          {this.state.stores.length && <h2>List of stores</h2>}

          <ul>
            {this.state.stores.length &&
            this.state.stores.map(this.renderStore)}
          </ul>
        </div>

    );
  }
}