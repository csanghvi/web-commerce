import React, { Component } from 'react'
import TicketsModal from "./TicketsModal"

export default class ListingDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             id:1
        }
    }

    componentDidMount(){
        const { id } = this.props.id
        console.log('Id is %o', id)
    }
    
    render() {
        return (
            <div className="ui stretched two column grid">
                    <div className="column"><img src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=2700&q=80" class="ui image" /></div>
                    <div class="column centered">
                        <div class="segment"> 
                            <span className="heading-primary">Event Title </span>
                            <span>Event Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur finibus, ligula eu eleifend consequat, sem metus dignissim purus, et sodales eros ligula non lacus. Maecenas lacinia nibh at semper efficitur. Fusce tincidunt, mi non tincidunt faucibus, neque velit hendrerit tortor, non fermentum nisi tortor at dui.</span>
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
                            <TicketsModal />
                        </div>
                    </div>
            </div>
            
        )
    }
}
