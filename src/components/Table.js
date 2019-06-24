import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/Table.css';

class Table extends Component {
  render() {
    const { recordsProp } = this.props
    return (
      <table className="table-container">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Name</th>
            <th>Public Repos</th>
            <th>Public Gists</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {
            recordsProp.map((val,ind)=> {
              return (
                <tr key={ind}>
                  <td>
                    {val.login}
                  </td>
                  <td>
                    {val.name}
                  </td>
                  <td>
                    {val.publicRepos}
                  </td>
                  <td>
                    {val.publicGists}
                  </td>
                  <td>
                    {val.followers}
                  </td>
                  <td>
                    {val.following}
                  </td>
                  <td>
                    {val.createdAt}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  recordsProp: PropTypes.array.isRequired
}

export default Table;