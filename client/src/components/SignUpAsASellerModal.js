import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Modal from 'react-modal';
import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import apiClient from '../api/apiClient';
import expressOauth from '../img/express-oauth.png'
import customAccountLink from '../img/customAccountLink.png'
import createCustomAccount from '../img/createCustomAccount.png'
import {Popup, Grid, Image, Button} from 'semantic-ui-react'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '30%',
      height                : 'auto'
      
    }
  };

  const PopupButtonAccountLink = (props) => (
    <Popup trigger={<button className="btn--green" ><a className="btn--text" href={props.customConnectStr}>Lets' go custom &rarr;</a></button>} 
   wide='very' basic hoverable position='bottom right' style={{marginTop:'100px', marginRight:'200px'}}>
      <Grid centered divided columns={1}>
        <Grid.Column textAlign='center'>
            <Image src={customAccountLink}></Image>
        </Grid.Column>
      </Grid>
    </Popup>
  )

const PopupButtonCustom = (props) => (
  <Popup trigger={<button className="btn--green" onClick={props.setupCustomConnect} style={{marginLeft:'4px'}}>Custom</button>} 
    wide='very' basic hoverable position='bottom right' style={{marginTop:'100px', marginRight:'200px'}}>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          <Image src={createCustomAccount}></Image>
      </Grid.Column>
    </Grid>
  </Popup>
)

  const PopupButtonExpress = (props) => (
  <Popup trigger={<button className="btn--green" onClick={props.handleExpressButton} >
    <a className="btn--text" target='_blank' href={props.connectStr}>Express</a>
    </button>} wide='very'  basic hoverable position='bottom left' offset='0, 50px' style={{marginTop:'100px', marginRight:'200px'}}>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          <Image src={expressOauth}></Image>
      </Grid.Column>
    </Grid>
  </Popup>
)


class SignUpAsASellerModal extends React.Component {
    constructor(props) {
        super(props)
        this.setIsOpen = this.setIsOpen.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        console.log("REACT APP Client id is %o", process.env.REACT_APP_STRIPE_CLIENT_ID)
        let accountType = this.props.currentUserObj.stripeAccountType === "CUSTOM" ? true : false
        let redirectUri = `${process.env.REACT_APP_BASEURL}/oauth/connect` || 'http://localhost:3000/oauth/connect'
        this.state = {
           isOpen:true,
           connectStr:`https://connect.stripe.com/express/oauth/authorize?redirect_uri=${redirectUri}&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&state=testing&suggested_capabilities[]=transfers&stripe_user[email]=${this.props.currentUserObj.email}&stripe_user[business_type]=individual&stripe_user[country]=US&stripe_user[first_name]=${this.props.currentUserObj.firstName}&stripe_user[last_name]=${this.props.currentUserObj.lastName}&stripe_user[phone_number]=0000000000&stripe_user[product_description]
='Collecting Payouts for Unemployment'`,
           isCustom:  accountType,
           customConnectStr: ''
        }
      }
      setIsOpen (flag){
        this.setState({
          isOpen:flag
        })
      }
    
       componentDidMount(){
         if(this.state.isCustom){
          apiClient.getCustomAccountLink(this.props.currentUserObj.stripeAccountId)
          .then(stripeRsp => {
            console.log('Accounts Url is %o', stripeRsp.url)
            this.setState({
              customConnectStr:stripeRsp.url,
              isCustom:true
            })
          })
         }
      }
    
      async openModal() {
        //Create Payment Intent
        this.setIsOpen(true);
      }
     
     
      closeModal(){
        this.setIsOpen(false);
      }

      setupCustomConnect = (e) => {
        console.log('Ask for custom connect')
        if (!this.props.currentUserObj.stripeAccountId) {
          console.log('Create Custom Connect Account')
          apiClient.createCustomConnect()
          .then(rsp => {
            console.log('Rsp received is %o', rsp)
            let stripeAccountId = rsp.stripeAccountId
            apiClient.getCustomAccountLink(stripeAccountId)
            .then(stripeRsp => {
              console.log('Url is %o', stripeRsp.url)
              this.setState({
                customConnectStr:stripeRsp.url,
                isCustom:true
              })
            })
          })
        } else {

            apiClient.getCustomAccountLink(this.props.currentUserObj.stripeAccountId)
            .then(stripeRsp => {
              console.log('Accounts Url is %o', stripeRsp.url)
              this.setState({
                customConnectStr:stripeRsp.url,
                isCustom:true
              })
            })
        }

      }

      handleExpressButton = () => {
        this.closeModal()
        this.props.selectAccountType('express')
      }

      renderConnectOptions = () => {
        return (
          <div>
            <div style={{color:'black', textAlign:'center'}}>
            This platform uses Stripe to get you paid quickly and keep your personal and payment information secure. 
            </div>
            <div className="submit-card-button" style={{marginTop:"8px"}}>
              <PopupButtonExpress handleExpressButton={this.handleExpressButton} connectStr={this.state.connectStr}/>
              <PopupButtonCustom setupCustomConnect={this.setupCustomConnect}/>

              
            </div>
          </div>
        )
      }

      renderCustomConnectLink = () => {
        return( 
        <div>
          <div className="sr-legal-text">
          Click here to be redirected to Stripe
          </div>
          <div className="submit-card-button" style={{marginTop:"4px"}}>
          <PopupButtonAccountLink customConnectStr={this.state.customConnectStr} />                                            
          </div>
        </div>        
        )
      }

      render() {
        const isCustom = this.state.isCustom
        return (
          <div>
              <Modal
                appElement={document.querySelector('#app')}
                isOpen={this.state.isOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Sign up to create listing"
                ariaHideApp={false}
              >
                {!isCustom ? 
                this.renderConnectOptions()
                :
                this.renderCustomConnectLink()
                }
              </Modal>
          </div>
        );
      }
}


const mapStateToProps = state => {
    return {
      currentUserObj: state.auth.userObj,
      isSignedIn: state.auth.isSignedIn,
      loginError: state.auth.loginError 
    };
  };
  
  export default connect(
    mapStateToProps,
    { signIn, signOut }
  )(SignUpAsASellerModal);