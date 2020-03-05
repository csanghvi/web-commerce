import React, { Component } from 'react'
import {
    Table,
    Segment,
    Icon
  } from "semantic-ui-react";



export default class MyPurchases extends Component {

    getPurchases = () => {
        return (
          <React.Fragment key={1}>
          <Table.Row key={1}>
            <Table.Cell width="4">{"Test"}</Table.Cell>
            <Table.Cell width="5">
              <Icon
                name="angle right"
                id={"123"}
                onClick={this.selectOrder}
              />
            </Table.Cell>
            <Table.Cell width="3"/>
            <Table.Cell textAlign='right' width="4">
                      <Icon
                        floating="true"
                        button="true"
                        name="setting"
                        id={"123"}
                        onClick={this.selectOrderAction}
                      />
            </Table.Cell>
    
          </Table.Row>
        </React.Fragment>
        );
      };

    render() {
        return (
            <div className="ui container">
            <Segment>
              <Table striped color="red" key="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width="4">Order</Table.HeaderCell>
                    <Table.HeaderCell width="5" />
                    <Table.HeaderCell textAlign='right' width="3">Updated</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right' width="4">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{this.getPurchases()}</Table.Body>
              </Table>
            </Segment>
          </div>
        )
    }
}
