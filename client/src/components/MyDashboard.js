import React, { Component } from 'react'
import { Grid, Image, Segment, Table, Icon, Button, Header, Menu, Message, Popup} from "semantic-ui-react"
import { Redirect, Link, withRouter } from "react-router-dom";
import apiClient from '../api/apiClient'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import _ from 'lodash';
import payout from '../img/payout.png'
import reversal from '../img/reversal.png'

const PopupRefund = (props) => {
    var issueRefund = (e,data) => {
        apiClient
        .setTransferReversal(data.value)
        .then(res => {
            
        })
    }
    return (
    <Popup trigger={<Button onClick={issueRefund} value={props.value} color="red" >Choose</Button>} flowing hoverable>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          <Image src={reversal}></Image>
      </Grid.Column>
    </Grid>
  </Popup>
  )
}

  const PopupPayout = (props) => {
      var sendPayout = (e,data) => {
        console.log('Amount of payout is %o & stripe account id is %o', data.value, props.stripeAccountId)
        apiClient
        .sendPayout(data.value, props.stripeAccountId)
        .then(res => {
            
        })
      }
      return (
    <Popup trigger={<Button onClick={sendPayout} value={props.amount} color="red" >Choose</Button>} flowing hoverable>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          <Image src={payout}></Image>
      </Grid.Column>
    </Grid>
  </Popup>
  )
  }

const PopupOptions = (props) => (
    <Popup trigger={<Icon name='setting'></Icon>} flowing on='[click,hover]'>
      <Grid centered divided columns={2}>
        <Grid.Column textAlign='center'>
        <Header as='h4'>Issue Refund</Header>
            {!props.refunded ? 
            <PopupRefund value={props.value}/>
            :
            <Icon name='refresh' color='red' />
            }
        </Grid.Column>
        <Grid.Column textAlign='center'>
        <Header as='h4'>Force Payout</Header>
          <PopupPayout amount={props.amount} stripeAccountId={props.stripeAccountId}/>
        </Grid.Column>
      </Grid>
    </Popup>
  )

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
            const charges = _.orderBy(rsp, ['created'],['desc'])
            console.log("In fetch all charges %o", charges)
            this.setState({
                charges:charges
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

    selectOrderAction = (e,data) => {
        console.log('Value of e is %o, data is %o', e.target.value)
        apiClient
        .setTransferReversal(e.target.value)
        .then(res => {
            this.setState(this.state)
        })

    }
    renderChargesTable = () =>{
        const charges = this.state.charges;
        var chargeItems = ""
        
        if (charges){
            chargeItems = charges.map(charge => {
                var date = new Date(charge.created*1000)
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var fullDate = day + "-" +(month + 1) + "-" + year
                var eventDate
                var eventTitle
                var eventId
                if (charge.metadata){
                    eventDate = charge.metadata.selectedDate
                    eventTitle = charge.metadata.listingTitle
                    eventId = charge.metadata.listingId
                }
                var eventdate 
                return (
                <React.Fragment key={charge.id}>
                    <Table.Row key={charge.id}>
                        <Table.Cell width="4">{charge.id}</Table.Cell>
                        <Table.Cell width="2">${Number.parseFloat(charge.amount/100).toFixed(2)}</Table.Cell>
                        <Table.Cell width="2"> ${Number.parseFloat((charge.amount - charge.application_fee_amount)/100).toFixed(2)}
                        </Table.Cell>
                        <Table.Cell textAlign='right' width="2"> {eventDate}</Table.Cell>
                        <Table.Cell textAlign='right' width="2"> <a style={{color:'blue'}} href={`/listings/:${eventId}`}>{eventTitle}</a></Table.Cell>
                        <Table.Cell textAlign='right' width="2"> {fullDate}</Table.Cell>
                        <Table.Cell textAlign='right' width="2">
                        <PopupOptions refunded={charge.refunded} value={charge.source_transfer} amount={(charge.amount - charge.application_fee_amount)} stripeAccountId={this.props.currentUserObj.stripeAccountId}></PopupOptions>
                        </Table.Cell>
            
                    </Table.Row>
              </React.Fragment>
             )
            })
        }

        return chargeItems
    }
    renderAccountWarning = () => {
        let accountWarning = <span/>
        if (this.props.currentUserObj.stripeAccountType !== 'EXPRESS' && !this.props.currentUserObj.stripeAccountPayouts){
            accountWarning =   
                                <Message warning>
                                <h3> You must create bank account to receive payouts! </h3>
                                     You can set it up
                                    <Link to = '/bank-account' style={{color:'blue'}}> here</Link>
                               </Message>
        }
        return accountWarning
    }
    
    render() {
        return (
            <div className="ui container">
                  <Grid divided='vertically' centered columns={2}>
                  <Grid.Row columns={2}>
                        <Grid.Column>
                            {this.renderAccountWarning()}
                         </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                             <Segment placeholder>
                                 <Header as='h3' textAlign={"center"}>
                                    <Icon name='dollar' />
                                    <Header.Content>Total Volume: ${this.state.totalVolume}</Header.Content><br/>
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
                    <Grid.Row >
                        <Grid.Column >
                                <Table striped color="red" key="red">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width="4">Payment Id</Table.HeaderCell>
                                            <Table.HeaderCell width="2">Amount</Table.HeaderCell>
                                            <Table.HeaderCell width="2"> Net </Table.HeaderCell>
                                            <Table.HeaderCell width="2"> Event Date </Table.HeaderCell>
                                            <Table.HeaderCell width="2"> Event </Table.HeaderCell>
                                            <Table.HeaderCell textAlign='right' width="2">Purchase Date</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='right' width="2">Actions</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>{this.renderChargesTable()}</Table.Body>
                                    <Table.Footer>
                                            <Table.Row>
                                                <Table.HeaderCell colSpan='7'>
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