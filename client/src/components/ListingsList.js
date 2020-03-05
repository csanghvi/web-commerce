import React, { Component } from 'react'
import { Link } from "react-router-dom";
import data from "../api/db.json"


export default class ListingsList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            listings:[]
        }
    }

    componentDidMount() {
        const listings = data.listings
        console.log('Listings is %o', listings)
        this.setState({
            listings:listings
        })
    }

    renderList = () => {
        const list = this.state.listings;
        if (list.length < 4) {
          while (list.length < 4) {
            list.push({id: Math.random()});
          }
        }
      
        let listItems = [];
      
        if (list) {
          listItems = list.map((l) => (
            <li className="listing-item" key={l.id}>
              <div className="clip">
                {l.title && (
                  <Link to={`/listings/` + l.id}>
                      {<img src={l.image} />}
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