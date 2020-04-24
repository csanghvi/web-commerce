import React from 'react'
import { Header, Button, Popup, Grid, Image } from 'semantic-ui-react'
import paymentIntent from '../img/paymentIntent.png'

const PopupButton = (props) => (
  <Popup trigger={<button onClick={props.openModal} className="btn btn-half" disabled={!(props.selectedQuantity > 0)}>Pay with cards</button>} flowing hoverable>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          <Image src={paymentIntent}></Image>
      </Grid.Column>
    </Grid>
  </Popup>
)

export default PopupButton