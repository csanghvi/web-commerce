import React, { Component } from 'react';
import MyPurchases from './MyPurchases';
import MyListings from './MyListings'
import MyDashboard from './MyDashboard'
import { Menu} from "semantic-ui-react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";


class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.onChangeContentType = this.onChangeContentType.bind(this);
        this.state = {
          contentType:'Purchases'
      };
    }


    onChangeContentType =(e, { value }) => {
      console.log("Value is %o", value);
        this.setState({
          contentType:value
        })
    }



      render() {
        return (
            <div>
              <div>
                <Menu attached='top' tabular>
                  <Menu.Item className="heading-secondary" name='Buyer Dashboard' value= 'Purchases' active={this.state.contentType === 'Purchases'} onClick={this.onChangeContentType} />
                  {Object.prototype.hasOwnProperty.call(this.props.currentUserObj, 'stripeAccountId') && 
                  <React.Fragment>
                    <Menu.Item className="heading-secondary" name='Listings' value='Listings' active={this.state.contentType === 'Listings'} onClick={this.onChangeContentType} />
                    <Menu.Item className="heading-secondary" name='Seller Dashboard' value='Dashboard' active={this.state.contentType === 'Dashboard'} onClick={this.onChangeContentType} />
                  </React.Fragment>
                  }
                  {/*
                  <Menu.Item name='Questions' active={this.state.contentType === 'Questions'} onClick={this.onChangeContentType} />
                  <Menu.Item name='Tips' active={this.state.contentType === 'Tips'} onClick={this.onChangeContentType} />
                  */}
                </Menu>
              </div>
            {this.state.contentType === 'Purchases' && (
              <MyPurchases/>
            )}
            {this.state.contentType === 'Listings' && (
              <MyListings/>
            )}
            {this.state.contentType === 'Dashboard' && (
              <MyDashboard/>
            )}
          </div>
        )
    }
}


const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn,
    loginError: state.auth.loginError 
  };
};

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(MyProfile);