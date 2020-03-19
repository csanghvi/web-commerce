import React, { Component } from 'react'
import {Grid, Image, Menu, Segment, Header, Button, Icon} from "semantic-ui-react"

export default class SubscriptionOptions extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            activeItem:''
        }
    }
    
   
    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  
    render() {
        const { activeItem } = this.state
        return (
            <div className="ui container">
                 <Grid divided='vertically' centered>
                    <Grid.Row columns={1} centered>
                    <Segment placeholder>
                        <Header icon>
                        <Icon name='pdf file outline' />
                        No documents are listed for this customer.
                        </Header>
                        <Button primary>Add Document</Button>
                    </Segment>
                    </Grid.Row>

                    <Grid.Row columns={5} centered>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={4}>
                    <Menu vertical>
                        <Menu.Item color={"red"}>
                            <Menu.Header>Products</Menu.Header>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>CMS Solutions</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='rails'
                            active={activeItem === 'rails'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='python'
                            active={activeItem === 'python'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='php'
                            active={activeItem === 'php'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Hosting</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='shared'
                            active={activeItem === 'shared'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='dedicated'
                            active={activeItem === 'dedicated'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Support</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='email'
                            active={activeItem === 'email'}
                            onClick={this.handleItemClick}
                            >
                            E-mail Support
                            </Menu.Item>

                            <Menu.Item
                            name='faq'
                            active={activeItem === 'faq'}
                            onClick={this.handleItemClick}
                            >
                            FAQs
                            </Menu.Item>
                        </Menu.Menu>
                        </Menu.Item>
                    </Menu>                    
                    </Grid.Column>
                    <Grid.Column width={4}>
                    <Menu vertical>
                        <Menu.Item>
                        <Menu.Header>Products</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='enterprise'
                            active={activeItem === 'enterprise'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='consumer'
                            active={activeItem === 'consumer'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>CMS Solutions</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='rails'
                            active={activeItem === 'rails'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='python'
                            active={activeItem === 'python'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='php'
                            active={activeItem === 'php'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Hosting</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='shared'
                            active={activeItem === 'shared'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='dedicated'
                            active={activeItem === 'dedicated'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Support</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='email'
                            active={activeItem === 'email'}
                            onClick={this.handleItemClick}
                            >
                            E-mail Support
                            </Menu.Item>

                            <Menu.Item
                            name='faq'
                            active={activeItem === 'faq'}
                            onClick={this.handleItemClick}
                            >
                            FAQs
                            </Menu.Item>
                        </Menu.Menu>
                        </Menu.Item>
                    </Menu> 
                    </Grid.Column>
                    <Grid.Column width= {4}>
                    <Menu vertical>
                        <Menu.Item>
                        <Menu.Header>Products</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='enterprise'
                            active={activeItem === 'enterprise'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='consumer'
                            active={activeItem === 'consumer'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>CMS Solutions</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='rails'
                            active={activeItem === 'rails'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='python'
                            active={activeItem === 'python'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='php'
                            active={activeItem === 'php'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Hosting</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='shared'
                            active={activeItem === 'shared'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='dedicated'
                            active={activeItem === 'dedicated'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Support</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='email'
                            active={activeItem === 'email'}
                            onClick={this.handleItemClick}
                            >
                            E-mail Support
                            </Menu.Item>

                            <Menu.Item
                            name='faq'
                            active={activeItem === 'faq'}
                            onClick={this.handleItemClick}
                            >
                            FAQs
                            </Menu.Item>
                        </Menu.Menu>
                        </Menu.Item>
                    </Menu> 
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
