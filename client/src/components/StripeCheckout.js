import React, { Component } from 'react'
import * as qs from 'query-string';
import apiClient from '../api/apiClient';
import { Router, Link } from 'react-router-dom';
import { Grid, Image, Header,Segment, Icon} from "semantic-ui-react"



export default class StripeCheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
             sessionJSON: "",
             image:''
        }
    }
    
    componentDidMount () {
        let currentComponent = this;
        console.log('Params is %o', this.props.sessionId.session_id)
        if (this.props.sessionId) {
            apiClient.getCheckoutSession(this.props.sessionId.session_id)
            .then(function(response){
                console.log('Session is %o', response)
              var sessionJSON = JSON.stringify(response.data.session, null, 4);
              currentComponent.setState({
                  sessionJSON:sessionJSON,
                  image:response.data.session.display_items[0].custom.images[0]
              })
            })
            .catch(function(err){
              console.log('Error when fetching Checkout session', err);
            });
        }
    }
    render() {

        return (
            <Grid divided='vertically' centered columns={2}>
              <Grid.Row columns={2}>
                  <Grid.Column>
                       <Segment placeholder>
                           <Header as='h2' textAlign={"center"}>
                              <Icon name='checkmark' color='green'/>
                              <Header.Content style={{color:'green'}}>Payment Succeeded</Header.Content><br/>
                           </Header>
                           {this.state.sessionJSON}
                           <Link to='/listings'><button className="btn btn-half" style={{textAlign:'center'}}>Return to listings</button></Link>
                      </Segment>
                  </Grid.Column>
                  <Grid.Column>
                     <Image
                        src={this.state.image}
                        />
                  </Grid.Column>
              </Grid.Row>
              </Grid>
         )
    }
}
