import React, { Component } from 'react'
import {Grid, Image, Menu, Segment, Header, Button, Icon, Table, Message} from "semantic-ui-react"
import Modal from 'react-modal';
import img from '../img/nat-7.jpg'
import apiClient from '../api/apiClient'
import Carousel from "./Carousel"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Checkout from './Checkout'
import { connect } from 'react-redux';
import { signIn, signOut, setRelayUrl } from "../actions";

const stripePromise = loadStripe('pk_test_XvODp9OF6PFNt7Yka7dieFYp00MTqbXTDK')
const stripe = window.Stripe('pk_test_XvODp9OF6PFNt7Yka7dieFYp00MTqbXTDK')


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '30%',
      height                : 'auto'
      
    }
  };


class SubscriptionOptions extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            activeItem:'',
            plans:[],
            selectedPlan:'',
            isOpen:false,
            paymentResult: {}
        }
    }
    
    componentDidMount () {
        apiClient.fetchAllPlans()
        .then (rsp => {
            console.log("Rsp is %o", rsp)
            apiClient.fetchCurrentSubscriptions(this.props.currentUserObj.stripeCustomerId)
            .then(res => {
                if (res.length > 0){
                    const nonMetedPlan = res.filter(subscriptionObj => {
                        if (subscriptionObj.plan.usage_type === 'licensed'){
                            return subscriptionObj
                        }
                    }) 
                    console.log("Non meted plans is %o", nonMetedPlan[0])
                    this.setState({
                        plans:rsp,
                        paymentResult: nonMetedPlan[0]
                    })   
                } else {
                    this.setState({
                        plans:rsp
                    })  
                }
            })
        })
    }

     openModal = () => {
        //Create Payment Intent
        this.setState({
            isOpen:true
        });
      }
     
     
      closeModal = () => {
        this.setState({
            isOpen:false
        });
      }

    handleSubscription = (e) => {
        console.log("received value is %o", e.target.value)
        let selectedPlan = this.state.plans.filter(plan => {if (plan.id === e.target.value) return plan })
        this.setState({
            selectedPlan: selectedPlan[0],
            isOpen: true
        })
    }

    setPaymentResult = (result) =>{
        this.setState({
          paymentResult:result,
          isOpen:false
        })
      }

    handleSubscriptionCancellation = () => {
        console.log("sending subscription cancellation for %o", this.state.paymentResult.id)
        apiClient.cancelSubscription(this.state.paymentResult.id)
        .then (sub => {
            if (sub.status === 'canceled'){
                this.setState({
                    paymentResult:{}
                })
            }
        })

    }

    handleSubscriptionChange = (e) => {
        console.log("received value is %o", e.target.value)
        this.setState({
            selectedPlan:e.target.value,
            isOpen: true
        })
    }

    returnSubscriptionButton = (plan, buttonName) => {
        var callbackFn = this.handleSubscriptionChange
        if (buttonName === 'Subscribe') {
            callbackFn = this.handleSubscription   
        }
        return (
            <Table.HeaderCell key={plan.id}>
            <Button
                floated='right'
                icon
                labelPosition='left'
                primary
                size='small'
                value={plan.id}
                onClick={callbackFn}
            >
                {buttonName}
            </Button>
        </Table.HeaderCell>
        )
    }

    returnCurrentPlanMessage = (plan, buttonName) => {
        return (
            <Table.HeaderCell key={plan.id}>
            <Message
                  success
                  header='current plan'
             />
          </Table.HeaderCell>
        )
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    renderSubscriptionButtons = () => {
        var plans = this.state.plans
        var selectedPlan = this.state.paymentResult
        let planItems = [<Table.HeaderCell />, <Table.HeaderCell/>, <Table.HeaderCell />]
        let tmpPlanItems = [<Table.HeaderCell />, <Table.HeaderCell/>, <Table.HeaderCell />]
        let tmp = []
        let plan1 = {}, plan2 = {}, plan3 = {}
        if (plans.length > 0){
            plan1 = plans.filter(plan => {if (plan.nickname.includes("Starter")) return plan})[0]
            plan2 = plans.filter(plan => {if (plan.nickname.includes("Pro")) return plan})[0]
            plan3 = plans.filter(plan => {if (plan.nickname.includes("Enterprise")) return plan})[0]
            if (JSON.stringify(selectedPlan) !== '{}'){
                switch (selectedPlan.plan.nickname) {
                    case "Starter Plan": {
                        planItems = [this.returnCurrentPlanMessage(plan1), this.returnSubscriptionButton(plan2, 'Change Subscription'), this.returnSubscriptionButton(plan3, 'Change Subscription')]
                    }
                    case "Pro Plan": {
                        console.log('Pro plan')
                        planItems = [this.returnSubscriptionButton(plan1, 'Change Subscription'), this.returnCurrentPlanMessage(plan2), this.returnSubscriptionButton(plan3, 'Change Subscription')]
                    }
                    case "Enterprise Plan": {
                        planItems = [this.returnSubscriptionButton(plan1, 'Change Subscription'), this.returnSubscriptionButton(plan2, 'Change Subscription'), this.returnCurrentPlanMessage(plan3)]
                    }   
                }
            } else {
                planItems = [this.returnSubscriptionButton(plan1, 'Subscribe'), this.returnSubscriptionButton(plan2, 'Subscribe'),this.returnSubscriptionButton(plan3, 'Subscribe')]
            }
         }   
        return planItems
    }

    renderPreContent = () =>{ 
        let returnItem = 
                        <div >
                            <h2> Pick a subscription from options below </h2>
                        </div>
        if (JSON.stringify(this.state.paymentResult) !== '{}' ) {
            var date = new Date(this.state.paymentResult.trial_end*1000)
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();
            var fullDate = day + "-" +(month + 1) + "-" + year;

            returnItem =   <div>
                            <Message success>
                                <h3> {`You have subscribed to ${this.state.paymentResult.plan.id}`} </h3>
                                     You can view your invoice
                                      <a  target="_blank" style={{color:"blue"}} href={this.state.paymentResult.latest_invoice.hosted_invoice_url}> here</a>
                            </Message>
                            <Table celled striped>
                                <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='3'>Subscription details</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                <Table.Row>
                                    <Table.Cell collapsing>
                                    Subscription Type
                                    </Table.Cell>
                                   <Table.Cell>{this.state.paymentResult.status}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                    Next Invoice Date
                                    </Table.Cell>
                                    <Table.Cell>{fullDate}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                     Plan
                                     </Table.Cell>
                                    <Table.Cell>{this.state.paymentResult.plan.nickname}</Table.Cell>
                                </Table.Row>
                                </Table.Body>
                                <Table.Footer fullWidth>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='4'>

                                        <Button negative onClick={this.handleSubscriptionCancellation}>Cancel Subscription</Button>

                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>                                
                            </Table>
                            </div>
                             
        }
        return returnItem
    }

    renderPlansTable = () =>{ 
        let amountPro = 0
        let amountStarter = 0
        let amountEnterprise = 0

        this.state.plans.map(plan => {
                if (Object.prototype.hasOwnProperty.call(plan, "amount")) {
                    switch (plan.nickname){
                        case "Enterprise Plan":
                            amountEnterprise = Number(plan.amount/100)
                        case "Pro Plan":
                            amountPro = Number(plan.amount/100)
                        case "Starter Plan":
                            amountStarter = Number(plan.amount/100)
                        default:
                            console.log("Plan type not found")
                    }
                } 
            })
        let returnItem = <span></span>
        //if (JSON.stringify(this.state.paymentResult) === '{}' ) {
            returnItem =                     
            <Grid.Row columns={3} centered>
            <Grid.Column width={3}>
            </Grid.Column>
            <Grid.Column width={10}>
            <Table compact celled definition>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Starter Plan</Table.HeaderCell>
                    <Table.HeaderCell>Pro Plan</Table.HeaderCell>
                    <Table.HeaderCell>Enterprise Plan</Table.HeaderCell>
                    <Table.HeaderCell>Premium Plan</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row>
                    <Table.Cell collapsing>
                    Price
                    </Table.Cell>
                    <Table.Cell>${amountStarter} </Table.Cell>
                    <Table.Cell>${amountPro}</Table.Cell>
                    <Table.Cell>${amountEnterprise}</Table.Cell>
                    <Table.Cell>Custom Pricing</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Fee per paid ticket*
                    </Table.Cell>
                    <Table.Cell>4%</Table.Cell>
                    <Table.Cell>3%</Table.Cell>
                    <Table.Cell>2.5%</Table.Cell>
                    <Table.Cell>Custom</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Customer support
                    </Table.Cell>
                    <Table.Cell>Online help center</Table.Cell>
                    <Table.Cell>Online help center</Table.Cell>
                    <Table.Cell>Phone, chat, email for paid events</Table.Cell>
                    <Table.Cell>24/7 support</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Ticketing & Registration 
                    </Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Onsite support
                    </Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Social media marketing
                    </Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell collapsing>
                    Customer Success
                    </Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                    <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                </Table.Row>
                </Table.Body>

                <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    {this.renderSubscriptionButtons()}
                    <Table.HeaderCell >
                        <Button
                            floated='right'
                            icon
                            labelPosition='left'
                            primary
                            size='small'
                            value={"Premium"}
                            onClick={this.handleSubscription}
                        >
                            Contact
                        </Button>
                    </Table.HeaderCell>

                </Table.Row>
                </Table.Footer>
            </Table>

        </Grid.Column>
        <Grid.Column width={3}>
        </Grid.Column>
        </Grid.Row>

        //}
        return returnItem
    }
  
    render() {
        const { activeItem } = this.state
        const plan = this.state.selectedPlan
        console.log('Selected plan is %o', plan)


        return (
            <div className="ui container">
                 <Grid  centered>
                    <Grid.Row columns={1} centered>
                    <Segment placeholder className="ui container " style={{width:"50%"}}>
                         {this.renderPreContent()}
                    </Segment>
                    </Grid.Row>
                    {this.renderPlansTable()}
                    <Modal
                        appElement={document.querySelector('#app')}
                        isOpen={this.state.isOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Payment Modal"
                        ariaHideApp={false}
                    >
                        {this.state.isOpen &&
                        <Elements stripe={stripePromise}>
                            <Checkout type={"subscription"} id={plan.id} 
                                                            nickname={plan.nickname} 
                                                            hasFreeTrial={plan.trial_period_days}
                                                            paymentResult={this.setPaymentResult} 
                                                            totalAmount={plan.amount}/>
                        </Elements>
                        }
                    </Modal>

                </Grid>
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
  )(SubscriptionOptions);