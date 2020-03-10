import React, { Component } from 'react'
import { Link } from "react-router-dom";
import data from "../api/db.json"
import apiClient from '../api/apiClient/index.js';


export default class ListingsList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            listings:[]
        }
    }

    componentDidMount() {
      /*
        const listings = data.listings
        console.log('Listings is %o', listings)
        this.setState({
            listings:listings
        })
        */

       const filter = {
         location: this.props.location || '',
         startDate: this.props.startDate || '',
         endDate: this.props.endDate || '', 
         email: this.props.email || ''
       }
       console.log("Filter is %o", filter)
       apiClient.getAllListings(filter)
       .then(rsp => {
         console.log("All listings are %o", rsp)
        this.setState({
          listings:rsp
         })
       })
    }

    renderList = () => {
        const list = this.state.listings;
        console.log("List is %o", list)
        if (list.length < 4) {
          while (list.length < 4) {
            list.push({id: Math.random()});
          }
        }
      
        let listItems = [];
      
        if (list) {
          listItems = list.map((l) => (
            <li className="listing-item" key={l._id}>
              <div className="clip">
                {l.title && (
                  <Link to={`/listings/` + l._id}>
                      {<img src={l.images[0]} />}
                      <div className="overlay" />
                      <h2>{l.location}</h2>
                      <h3>{l.title}</h3>
                  </Link>
                )}
              </div>
            </li>
           ));
        } 
        
        return listItems;

    }
    
    render() {
        return (
            <div>
                <ul className="listings-list">
                    {this.renderList()}
                </ul>                
            </div>
        )
    }
}