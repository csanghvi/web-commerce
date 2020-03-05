import React, { Component } from 'react'
import TicketsModal from "./TicketsModal"
import { connect } from 'react-redux';
import { signIn, signOut, setRelayUrl } from "../actions";
import { Link } from "react-router-dom";
import data from "../api/db.json"
import Carousel from "./Carousel"



class ListingDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             listing:null
        }
    }

    componentDidMount(){
        const { id } = this.props.id
        console.log('Id is %o', id)
        var listing = data.listings.filter(listing => {
            if (listing.id === id) {
                return listing
            }
        })
        console.log('listing is %o', listing[0])
        this.setState({
            listing:listing[0]
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
    render() {
        if (this.state.listing){
            var source = this.state.listing.source
            var location = this.state.listing.location
            var image = this.state.listing.image;
            var image2 = this.state.listing.image2 || "";
            var title = this.state.listing.title || ""
            var desc = this.state.listing.description || ""
            var title = this.state.listing.title || ""
        }
        const url =  source || ""
        return (
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
                        <div class="segment">
                            {this.props.isSignedIn ? this.props.id ?
                             <TicketsModal id={this.props.id.id} /> : null
                             :
                            <button className="btn btn-full" onClick={this.setComeBackUrl}><Link to = '/login'>Login to buy tickets</Link></button> }
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