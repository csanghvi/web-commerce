import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react'

import Search from "./Search";

export default class Navbar extends Component{
  render(){
    return(
        <div>

            <ul className="navigation">
                <span className='navigation_title'>
                    <li><Link to = '/'>Experience</Link></li>
                </span>
                <li className='navigation_list'><Link to='/register'>Sign up</Link></li>
                <li className='navigation_list'><Link to = '/login'>Sign in</Link></li>
                <li className='navigation_list'><Link to='/new'> <Icon name='plus' /></Link></li>
            </ul>
        </div>

    )
  }
}
