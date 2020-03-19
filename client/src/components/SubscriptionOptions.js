import React, { Component } from 'react'
import {Grid, Image, Menu, Segment, Header, Button, Icon, Table, Checkbox} from "semantic-ui-react"

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

                    <Grid.Row columns={3} centered>
                        <Grid.Column width={4}>
                        </Grid.Column>
                        <Grid.Column width={8}>
                        <Table compact celled definition>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell>Starter Plan</Table.HeaderCell>
                                <Table.HeaderCell>Pro Plan</Table.HeaderCell>
                                <Table.HeaderCell>Enterprise Plan</Table.HeaderCell>
                                <Table.HeaderCell>Premium Plan</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>

                            <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Fee per paid ticket*
                                </Table.Cell>
                                <Table.Cell>4%</Table.Cell>
                                <Table.Cell>3%</Table.Cell>
                                <Table.Cell>2.5%</Table.Cell>
                                <Table.Cell>Custom</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Customer support
                                </Table.Cell>
                                <Table.Cell>Online help center</Table.Cell>
                                <Table.Cell>Online help center</Table.Cell>
                                <Table.Cell>Phone, chat, email for paid events</Table.Cell>
                                <Table.Cell>24/7 support</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Ticketing & Registration 
                                </Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Onsite support
                                </Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Social media marketing
                                </Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell collapsing>
                                Customer Success
                                </Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="stop circle" color="red"/></Table.Cell>
                                <Table.Cell><Icon name="check" color="green"/></Table.Cell>
                            </Table.Row>
                            </Table.Body>

                            <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell>
                                <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'
                                >
                                    Subscribe
                                </Button>
                                </Table.HeaderCell>
                                <Table.HeaderCell>                                
                                    <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'
                                      >
                                    Subscribe
                                </Button>
                                </Table.HeaderCell>
                                <Table.HeaderCell>                                
                                    <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'
                                      >
                                    Subscribe
                                </Button>
                                </Table.HeaderCell>
                                <Table.HeaderCell>                                
                                    <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'
                                      >
                                    Subscribe
                                </Button>
                                </Table.HeaderCell>
                            

                            </Table.Row>
                            </Table.Footer>
                        </Table>

                    </Grid.Column>
                    <Grid.Column width={4}>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
