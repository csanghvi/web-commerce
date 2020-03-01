import React, { Component, useState } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'

import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
 
const AppWithBasic = () => {
  const [currentDate, setNewDate] = useState(null);
  const onChange = (event, data) => setNewDate(data.value);
 
  return <SemanticDatepicker type="range" onChange={onChange} />;
};

class Search extends Component {
    constructor(props) {
        super(props)
        this.filterListings = this.filterListings.bind(this)
        this.state = {
             
        }
    }
    
    filterListings() {
        console.log("Tests")
    }

    render() {
        return (
                    <div>                    
                            <div class="u-margin-bottom-medium">
                                <h2 class="heading-secondary">
                                Book your next experience
                                </h2>
                            </div>


                            <form action="#" class="form">

                            <div class="form__group">
                                <input type="text" class="form__input" placeholder="San Francisco" id="name" />
                                <label for="name" class="form__label">Location</label>
                            </div>

                            <div class="form__group">
                                <AppWithBasic />              
                            </div>

                            <div class="form__group">
                                <button className="btn--green"><Link to="/listings" className="btn--text">Lets' go &rarr;</Link></button>
                            </div>
                            </form>
    
                     </div>
                        

        )
    }
}


export default withRouter(Search)