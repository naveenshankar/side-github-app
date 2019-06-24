import React, { Component } from 'react';
import '../styles/Search.css';
import PropTypes from 'prop-types';
const gitHubEndPt = 'https://api.github.com/users/';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currVal: ''
    };
  }

  persistOnEnter = async (e) => {
    const { persistFn } = this.props;
    if (e.key === 'Enter' && e.target.value.length > 0) {
      try{
        const inputVal = e.target.value;
        const finalURL = `${gitHubEndPt}${inputVal}`;
        const dataPromise = await fetch(finalURL);
        if(dataPromise.status === 200) {
          const data = await dataPromise.json();
          persistFn({
            error: false,
            message: '',
            data
          });
        } else {
          throw new Error(`User ${inputVal} is ${dataPromise.statusText}`);
        }
      } catch(e) {
        persistFn({
          error: true,
          message: e.message
        });
      }
    }
  }

  updateCurrVal = (e) => {
    const newVal = e.target.value;
    this.setState((oldState, props) => {
      const { isEditingFn } = props;
      isEditingFn();
      return {
        currVal: newVal
      };
    });
  }

  render() {
    const { pageLoading } = this.props;
    const { currVal } = this.state;
    const disabledclass = pageLoading ? 'disabled' : '';
    return (
      <div className='search-container'>
        <input disabled={disabledclass} onChange={this.updateCurrVal} onKeyUp={this.persistOnEnter} value={currVal} className={`search-input ${disabledclass}`} placeholder='Enter a username'></input>
      </div>
    );
  }
}

Search.propTypes = {
  pageLoading: PropTypes.bool.isRequired,
  persistFn: PropTypes.func.isRequired,
  isEditingFn: PropTypes.func.isRequired,
}

export default Search;
