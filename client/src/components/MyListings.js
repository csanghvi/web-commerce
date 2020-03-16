import React, { Component } from 'react'
import ListingsList from './ListingsList'
import { connect } from 'react-redux';
import { signIn, signOut, setRelayUrl } from "../actions";

class MyListings extends Component {
    constructor(props) {
        super(props)
    
    }
    
    render() {
        return (
            <div>
                <ListingsList email={this.props.currentUserObj.email}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      currentUserObj: state.auth.userObj,
      isSignedIn: state.auth.isSignedIn,
      relayUrl: state.relay.relayUrl
    };
  };
  
  export default connect(
    mapStateToProps,
    { signIn, signOut, setRelayUrl }
  )(MyListings);
