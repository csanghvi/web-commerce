import React, { Component } from 'react'
import TicketsModal from "./TicketsModal"
import { connect } from 'react-redux';
import { signIn, signOut, checkLoginStatus, setRelayUrl } from "../actions";
import { Link, Redirect } from "react-router-dom";
import data from "../api/db.json"
import Carousel from "./Carousel"
import apiClient from "../api/apiClient"
import { Rail, Segment, Table, Grid, Header, Image, Input } from "semantic-ui-react"
import DatePicker from './DatePicker'



class ListingDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             listing:null,
             readyForEdit:false,
             selectedQuantity:0,
             amount:0,
             date:''
        }
    }

    componentDidMount(){
        const { id } = this.props.id
        console.log('Id is %o', id)
        /*
        var listing = data.listings.filter(listing => {
            if (listing.id === id) {
                return listing
            }
        })
        console.log('listing is %o', listing[0])
        listing[0].email = "cbs@cbs.com"
        this.setState({
            listing:listing[0]
        })
        */
       apiClient.getListing(id)
       .then (rsp => {
        console.log("listing is %o", rsp)
        let listing = {
          title: rsp.title,
          details: rsp.details,
          images: rsp.images,
          numImages: rsp.images.length,
          location: rsp.location,
          email: rsp.email,
          id: rsp._id,
          price: rsp.price,
          maxQty: rsp.maxQty
        }
        this.setState({
            listing:listing
            })

       })
       .catch(err => {
         console.log("err in getting a listing with id %o", id)
       })
    }

    handleChangeDate = (event, data) => {
        console.log("Data value is %o", data.value.toString())
        let timeStamp = data.value.toString().split(' ').slice(0,4).join(' ')
        console.log("timestamp value is %o", timeStamp)
        this.setState({
          date:timeStamp
        })
    }

    handleQuantityChange = (e) => {
        console.log("Changed qty is %o", e.target.value)
        let totalAmount = Number(this.state.listing.price)*Number(e.target.value)
        this.setState({
            selectedQuantity: e.target.value,
            amount:totalAmount
        })
    }

    setComeBackUrl = () => {
        console.log('Logging this comeback url %o', this.state.listing.id)
        this.props.setRelayUrl(`/listings/` + this.state.listing.id)
        return 
    }
    
    renderTicketsModal = () => {
        if (this.state.id){
            return (
                <TicketsModal id={this.state.id} buyer={this.props.currentUserObj.email}/>
            )
        } else {
            return (<div/>)
        }
    }
    readyForEdit = () => {
        this.setState(prevState => ({
            readyForEdit:!prevState.readyForEdit
          }))
      }
    redirectAfterEdit = () => {
        if (this.state.readyForEdit)
            return <Redirect to={`/listings/edit/${this.state.listing.id}`} />;
      }
    renderEditOption = () => {
        if (this.state.listing && this.props.currentUserObj)
            console.log("Is signed in? %o, userObj.email is %o, this.state.listing.email is %o", this.props.isSignedIn,this.props.currentUserObj.email, this.state.listing.email )
        if (this.state.listing && this.props.isSignedIn && this.props.currentUserObj.email === this.state.listing.email)
            return (
                <div>
                    <span className="btn btn-half" style={{marginLeft: "45%", marginTop:"20px", width:"auto"}} onClick={this.readyForEdit}>Edit Listing</span>
                </div>
            )
    }



    render() {
        if (this.state.listing){
            
            var source = this.state.listing.images[0]
            var location = this.state.listing.location
            var image = this.state.listing.images[0]
            var image2 = this.state.listing.image2 || ""
            var title = this.state.listing.title || ""
            var desc = this.state.listing.details || ""
            var title = this.state.listing.title || ""
            var creator = this.state.listing.email || ""
            var price = this.state.listing.price || 0
            var maxQty = this.state.listing.maxQty || 10
        }
        
        const url =  source || ""
        return (
        <div>
            {this.renderEditOption()}
            {this.redirectAfterEdit()}
           
            
            <div className="ui vertically divided grid">
                 <div class="two column row">
                    <div className="column">
                        <Carousel source={source} image={source} image2={source} legend={location}/>
                    </div>
                    <div className="column" style={{marginTop:'50px'}}>
                        <Segment>
                        <Table basic='very' celled collapsing>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='2'>{title}</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='2'>{desc}</Table.Cell>
                            </Table.Row>
                            </Table.Header>

                            <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Event organized by
                                    </Header.Content>
                                </Header>
                                </Table.Cell>
                                <Table.Cell>{creator}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Price
                                        <Header.Subheader>per ticket</Header.Subheader>
                                    </Header.Content>
                                </Header>
                                </Table.Cell>
                                <Table.Cell>${price}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Enter quantity
                                    </Header.Content>
                                </Header>
                                </Table.Cell>
                                <Table.Cell>        <Input type="number" min="0" max={maxQty} id="quantity"  value={this.state.selectedQuantity}  onChange={this.handleQuantityChange} style={{width:"50px", color:"black",marginLeft:"8px"}}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Select Date
                                    </Header.Content>
                                </Header>
                                </Table.Cell>
                                <Table.Cell>       
                                     <DatePicker handleChangeDate={this.handleChangeDate} type={"basic"}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row disabled={!(this.state.amount>0)}>
                                <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Total Cost
                                    </Header.Content>
                                </Header>
                                </Table.Cell>
                                <Table.Cell>       
                                    <span style={{color:"blueviolet", padding:"16px"}}>${this.state.amount}</span>
                                </Table.Cell>
                            </Table.Row>
                            </Table.Body>
                        </Table>
                        <div className="segment">
                            {this.props.isSignedIn ? this.props.id ?
                            <TicketsModal buyer={this.props.currentUserObj.email} id={this.props.id.id} selectedQuantity={this.state.selectedQuantity} totalAmount={this.state.amount} selectedDate={this.state.date}/> : null
                            :
                            <button className="btn btn-half" onClick={this.setComeBackUrl}><Link to = '/login' style={{color:"black"}}>Login to buy tickets</Link></button> }
                        </div>
                        </Segment>
                    </div>

                 </div>
            </div>

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
    { signIn, signOut, checkLoginStatus, setRelayUrl }
  )(ListingDetails);