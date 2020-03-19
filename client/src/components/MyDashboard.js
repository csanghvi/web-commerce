import React, { Component } from 'react'
import { Grid, Image, Segment, Table, Icon, Button, Header, Menu} from "semantic-ui-react"
import apiClient from '../api/apiClient'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class MyDashboard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             charges:[],
             totalVolume:0,
             netVolume:0,
             availableBalance:0,
             pendingBalance:0
        }
    }

    componentDidMount () {
        apiClient.fetchAllCharges(this.props.currentUserObj.stripeAccountId)
        .then(rsp => {
            console.log("In fetch all charges %o", rsp)
            this.setState({
                charges:rsp
            })
        })
        apiClient.fetchBalanceTransactions(this.props.currentUserObj.stripeAccountId)
        .then(rsp => {
            var totalVolume = rsp
              .map(txn => {
                if (txn.type === "payment") return txn.amount;
              })
              .filter(amount => amount)
              .reduce((a, b) => a + b, 0);
            console.log("total volume is %o", Number.parseFloat(totalVolume / 100).toFixed(2));
            var netVolume = rsp
              .map(txn => txn.net)
              .filter(amount => amount)
              .reduce((a, b) => a + b, 0);
            console.log("net volume is %o", Number.parseFloat(netVolume / 100).toFixed(2));
            this.setState({
                totalVolume: Number.parseFloat(totalVolume / 100).toFixed(2),
                netVolume: Number.parseFloat(netVolume / 100).toFixed(2)
            })

        })
        apiClient.fetchBalanceDetails(this.props.currentUserObj.stripeAccountId)
        .then(rsp => {
            let available = rsp.available
                            .map(val => val.amount)
                            .reduce((a,b)=> a + b, 0)
            let pending = rsp.pending
                            .map(val => val.amount)
                            .reduce((a,b)=> a + b, 0)
            this.setState({
                availableBalance:Number.parseFloat(available / 100).toFixed(2),
                pendingBalance: Number.parseFloat(pending / 100).toFixed(2)
            })
            
        })
    }

    renderChargesTable = () =>{
        const charges = this.state.charges
        var chargeItems = ""
        if (charges){
            chargeItems = charges.map(charge => (
                <React.Fragment key={charge.id}>
                    <Table.Row key={charge.id}>
                        <Table.Cell width="5">{charge.id}</Table.Cell>
                        <Table.Cell width="3">${Number.parseFloat(charge.amount/100).toFixed(2)}</Table.Cell>
                        <Table.Cell width="3"> ${Number.parseFloat((charge.amount - charge.application_fee_amount)/100).toFixed(2)}
                        </Table.Cell>
                        <Table.Cell textAlign='right' width="3"> {charge.created}</Table.Cell>
                        <Table.Cell textAlign='right' width="2">
                            {!charge.refunded ? 
                                    <Button
                                    color="red"
                                    onClick={this.selectOrderAction}
                                    >Refund</Button>
                                    :
                                    <span style={{alignContent:"center"}}>
                                    <Icon
                                    name="refresh"
                                    color="red"
                                    />
                                    </span>
                                }
                        </Table.Cell>
            
                    </Table.Row>
              </React.Fragment>
             ))
        }

        return chargeItems
    }
    
    render() {
        return (
            <div className="ui container">
                  <Grid divided='vertically' centered columns={2}>

                    <Grid.Row columns={2}>
                        <Grid.Column>
                             <Segment placeholder>
                                 <Header as='h3' textAlign={"center"}>
                                    <Icon name='dollar' />
                                    <Header.Content>Total Volume: ${this.state.totalVolume}</Header.Content><n/>
                                    <Icon name='dollar' />
                                    <Header.Content>Net Volume: ${this.state.netVolume}</Header.Content>
                                 </Header>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                        <Segment placeholder>
                                 <Header as='h3' textAlign={"justified"}>
                                    <Icon name='dollar' />
                                    <Header.Content>Available Balance : ${this.state.availableBalance}</Header.Content><n/>
                                    <Icon name='dollar' />
                                    <Header.Content>Pending Balance: ${this.state.pendingBalance}</Header.Content>
                                 </Header>
                            </Segment>                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column >
                                <Table striped color="red" key="red">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width="5">Payment Id</Table.HeaderCell>
                                            <Table.HeaderCell width="3">Amount</Table.HeaderCell>
                                            <Table.HeaderCell width="3"> Net </Table.HeaderCell>
                                            <Table.HeaderCell textAlign='right' width="3">Created</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='right' width="2">Actions</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>{this.renderChargesTable()}</Table.Body>
                                    <Table.Footer>
                                            <Table.Row>
                                                <Table.HeaderCell colSpan='3'>
                                                    <Menu floated='right' pagination>
                                                        <Menu.Item as='a' icon>
                                                        <Icon name='chevron left' />
                                                        </Menu.Item>
                                                        <Menu.Item as='a'>1</Menu.Item>
                                                        <Menu.Item as='a'>2</Menu.Item>
                                                        <Menu.Item as='a'>3</Menu.Item>
                                                        <Menu.Item as='a'>4</Menu.Item>
                                                        <Menu.Item as='a' icon>
                                                        <Icon name='chevron right' />
                                                        </Menu.Item>
                                                    </Menu>
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
  )(MyDashboard);