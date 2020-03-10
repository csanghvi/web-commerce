import React, { Component } from 'react'
import TicketsModal from "./TicketsModal"
import { connect } from 'react-redux';
import { signIn, signOut, setRelayUrl } from "../actions";
import { Link, Redirect } from "react-router-dom";
import data from "../api/db.json"
import Carousel from "./Carousel"
import apiClient from "../api/apiClient"



class ListingDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             listing:null,
             readyForEdit:false
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
          location: rsp.location
        }
        this.setState({
            listing:listing
          })
       })
       .catch(err => {
         console.log("err in getting a listing with id %o", id)
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
                <TicketsModal id={this.state.id} />
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
            var image = this.state.listing.images[0];
            var image2 = this.state.listing.image2 || "";
            var title = this.state.listing.title || ""
            var desc = this.state.listing.details || ""
            var title = this.state.listing.title || ""
        }
        
        const url =  source || ""
        return (
        <div>
            {this.renderEditOption()}
            {this.redirectAfterEdit()}
            <div className="ui two column grid">
                    <div className="column centered"><Carousel source={source} image={image} image2={image2} legend={location}/></div>
                    <div class="column centered">
                        <div class="segment"> 
                            <span className="heading-primary">{title} </span>
                            <span>Event Details: {desc}.</span>
                        </div>
                        <div class="segment"> 
                            <span className="heading-tertiary">Event Details: Event organizer</span>
                        </div>
                        <div class="segment listing--date"> 
                            <time className="heading-secondary">
                                <p className="listing-hero-image--month">MAY</p>
                                <p className="listing-hero-image--day">10</p>
                            </time>
                        </div>
                        <div className="segment">
                            <div>
                                <button class="ui icon button">
                                    <i class="minus icon"></i>
                                </button>
                                <input type="number" min="0" max="10" id="quantity"  style={{width:"30px", color:"black"}}/>
                                <button class="ui right icon button">
                                    <i class="plus icon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="segment">
                            {this.props.isSignedIn ? this.props.id ?
                             <TicketsModal id={this.props.id.id} /> : null
                             :
                            <button className="btn btn-full" onClick={this.setComeBackUrl}><Link to = '/login'>Login to buy tickets</Link></button> }
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
    { signIn, signOut, setRelayUrl }
  )(ListingDetails);