import React, { Component } from 'react';
import Search from './Search';
import Table from './Table';
import Status from './Status';
import '../styles/App.css';
import firebaseConfig from '../config/firebase-config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      errorState: false,
      inSync: false,
      pageLoading: false,
      messages: []
    };
    this.firebaseObj = {};
  }

  processRecord = (data) => {
    const { login, html_url, followers, following, name, public_gists, public_repos, created_at } = data;
    const pRecord = {
      login,
      [data.login]: html_url,
      name,
      publicRepos: public_repos,
      publicGists: public_gists,
      followers,
      following,
      createdAt: created_at
    };
    return pRecord;
  }

  isEditing = () => {
    this.setState((oldState, props) => {
      return {
        inSync: false,
        messages: []
      };
    })
  }

  addOrReplaceDataInDB = (key, data) => {
    // Get a reference to the database service
    const database = firebase.database(); // eslint-disable-line

    return new Promise((resolve, reject) => {
      database.ref('users/' + key).set(data, function(error) {
        if (error) {
          // The write failed...
          reject('write failed')
        } else {
          // Data saved successfully!
          resolve('data saved')
        }
      });
    });
  }

  retrievingDataFromDB = () => {
    // Get a reference to the database service
    const database = firebase.database(); // eslint-disable-line
    const recordsFromDataBase = [];

    return new Promise((resolve, reject) => {
      database.ref('/users').on('value', function(snapShot){
        const numChildren = snapShot.numChildren();
        if(numChildren > 0) {
          snapShot.forEach(function(childSnapshot){
            var childData = childSnapshot.val();
            recordsFromDataBase.push(childData);
            if(numChildren === recordsFromDataBase.length){
              resolve(recordsFromDataBase);
            }
          });
        } else {
          resolve([]);
        }
      });
    });
  }

  persistUserOrShowError = async (response) => {

    if (response.error) {
      this.setState((oldState, props) => {
        return {
          errorState: true,
          inSync: true,
          messages: [response.message]
        };
      })
    } else {
      const{ data } = response;
      this.setState((oldState, props) => {
        return {
          errorState: false,
          inSync: false,
          messages: []
        };
      });

      const processedData = this.processRecord(data);
      const dbResponse = await this.addOrReplaceDataInDB(data.login, processedData);

      if(dbResponse === 'data saved') {
          this.setState((oldState, props) => {
            const oldRecs = oldState.records;
            const filteredRecords = oldRecs.length > 0 ? oldRecs.find((val)=> {
              return val.login === data.login;
            }) : undefined;
            if(!filteredRecords) {
              return {
                inSync: true,
                records: oldRecs.concat([processedData]),
                messages: [`User ${data.login} added to the DB!`]
              };
            }
            return {
              errorState: true,
              inSync: true,
              messages: [`User ${data.login} already exists in the DB!`]
            };
          });
      } else {
        this.setState((oldState, props) => {
          return {
            errorState: true,
            inSync: true,
            messages: [`Error adding ${data.login} to the DB`]
          };
        });
      }

    }
  }

  async componentDidMount() {
    if (Object.keys(this.firebaseObj).length === 0) {
      // Initialize Firebase
      this.firebaseObj = firebase.initializeApp(firebaseConfig); // eslint-disable-line
    }
    
    this.setState((oldState,props)=> {
      return {
        pageLoading: true
      };
    })
    const recordsFromDB = await this.retrievingDataFromDB();
    this.setState((oldState,props)=> {
      return {
        pageLoading: false,
        records: Object.assign([],recordsFromDB)
      };
    })
  }

  render() {
    const { pageLoading, records, inSync, errorState, messages } = this.state;
    return (
      <div className="App">
        <Search pageLoading={pageLoading} isEditingFn={this.isEditing} persistFn={this.persistUserOrShowError} />
        <Status inSync={inSync} errorState={errorState} messages={messages} />
        <Table recordsProp={records} />
      </div>
    );
  }
}

export default App;
