import React, { Component } from 'react'
import {
    Table,
    Segment,
    Icon
  } from "semantic-ui-react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import apiClient from "../api/apiClient"





class MyPurchases extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       orders:[]
    }
  }

  componentDidMount(){
    console.log("Fetch user orders")
    apiClient.fetchUserOrders(this.props.currentUserObj.email)
    .then(rsp => {
      console.log("Rsp is %o", rsp)
      this.setState({
        orders:rsp
      })
    })
  }
  
    getPurchases = () => {
      var list = this.state.orders
      if (list) {
        var listItems = list.map((l) => (
            <React.Fragment key={l._id}>
            <Table.Row key={l._id}>
              <Table.Cell width="5">{l.listingTitle}</Table.Cell>
              <Table.Cell width="4">{l.selectedDate}</Table.Cell>
              <Table.Cell width="2"> {l.qty}
              </Table.Cell>
              <Table.Cell textAlign='right' width="3"> {Number(l.amount/100)}.00$</Table.Cell>
              <Table.Cell textAlign='right' width="2">
                        <Icon
                          floating="true"
                          button="true"
                          name="setting"
                          id={"123"}
                          onClick={this.selectOrderAction}
                        />
              </Table.Cell>
      
            </Table.Row>
          </React.Fragment>
         ));
      } 
        return listItems
      };

    render() {
        return (
            <div className="ui container" style={{fontSize:"3rem"}}>
            <Segment>
              <Table striped color="red" key="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width="5">Title</Table.HeaderCell>
                    <Table.HeaderCell width="4">Event Date</Table.HeaderCell>
                    <Table.HeaderCell width="2"> Quantity </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right' width="3">Amount</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right' width="2">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{this.getPurchases()}</Table.Body>
              </Table>
            </Segment>
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
)(MyPurchases);