import React, { Component, useState } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import DatePicker from '../components/DatePicker'


class Search extends Component {
    constructor(props) {
        super(props)
        this.filterListings = this.filterListings.bind(this)
        this.state = {
            startDate:'',
            endDate:'',
            location:''
        }
    }
    
    filterListings() {
        console.log("Tests")
    }

    handleChangeDate = (event,data) => {
        this.setState({
        startDate:data.value[0],
        endDate:data.value[1]
        })
    }

    handleChangeLocation = (event) => {
        this.setState({
            location:event.target.value
        })
    }


    render() {
        return (
                    <div>                    
                            <div className="u-margin-bottom-medium">
                                <h2 className="heading-secondary">
                                Book your next experience
                                </h2>
                            </div>



                            <div className="form__group">
                                <input type="text" className="form__input" placeholder="San Francisco" id="name" onChange={this.handleChangeLocation}/>
                                <label className="form__label">Location</label>
                            </div>

                            <div className="form__group">
                                <DatePicker handleChangeDate={this.handleChangeDate} type={"range"} />              
                            </div>

                            <div className="form__group">
                            <button className="btn--green" ><Link to={{
                                                                        pathname: "/listings",
                                                                        state: { 
                                                                             location: this.state.location,
                                                                             startDate: this.state.startDate,
                                                                             endDate: this.state.endDate
                                                                            }
                                                                        }}
                                                                        className="btn--text">Lets' go &rarr;</Link></button>                            </div>
    
                     </div>
                        

        )
    }
}


export default withRouter(Search)