import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/Status.css';

class Status extends Component {
  render() {
    const { inSync, errorState, messages } = this.props;
    const classNm = inSync ? errorState ? 'status-red' : 'status-green' : 'status-hide';
    return (
      <div className={`status-container ${classNm}`}>
        {
          messages.map((val,ind)=>{
            return (
              <div key={ind}>
              {val}
            </div>
            );
          })
        }
      </div>
    );
  }
}

Status.propTypes = {
  inSync: PropTypes.bool.isRequired,
  errorState: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired
}

export default Status;