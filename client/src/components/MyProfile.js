import React, { Component } from 'react';
import MyPurchases from './MyPurchases';
import MyListings from './MyListings'
import { Menu} from "semantic-ui-react";


export default class ContentList extends Component {
    constructor(props) {
        super(props);
        this.onChangeContentType = this.onChangeContentType.bind(this);
        this.state = {
          contentType:'Onboarding'
      };
    }


    onChangeContentType =(e, { value }) => {
      console.log("Value is %o", value);
        this.setState({
          contentType:value
        })
    }



      render() {
        return (
            <div>
            <div>
              <Menu attached='top' tabular>
                <Menu.Item className="heading-secondary" name='Experiences' value= 'Purchases' active={this.state.contentType === 'Purchases'} onClick={this.onChangeContentType} />
                <Menu.Item className="heading-secondary" name='Listings' value='Listings' active={this.state.contentType === 'Listings'} onClick={this.onChangeContentType} />
                {/*
                <Menu.Item name='Questions' active={this.state.contentType === 'Questions'} onClick={this.onChangeContentType} />
                <Menu.Item name='Tips' active={this.state.contentType === 'Tips'} onClick={this.onChangeContentType} />
                */}
              </Menu>
            </div>
            {this.state.contentType === 'Purchases' && (
              <MyPurchases/>
            )}
            {this.state.contentType === 'Listings' && (
              <MyListings/>
            )}
          </div>
        )
    }
}
