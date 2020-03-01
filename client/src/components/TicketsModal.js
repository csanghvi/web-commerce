import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

const TicketsModal = () => (
  <Modal trigger={<button className="btn btn-primary">Buy Tickets</button>}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content image>
      <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
      <Modal.Description>
        <Header>Default Profile Image</Header>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

export default TicketsModal