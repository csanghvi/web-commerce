import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Modal from 'react-modal';
import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import apiClient from '../api/apiClient';


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

class SignUpAsASellerModal extends React.Component {
    constructor(props) {
        super(props)
        this.setIsOpen = this.setIsOpen.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        console.log("REACT APP CLIent id is %o", process.env.REACT_APP_STRIPE_CLIENT_ID)
        this.state = {
           isOpen:true,
           connectStr:`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&state=testing&suggested_capabilities[]=card_payments&stripe_user[email]=${this.props.currentUserObj.email}`,
           isCustom: false,
           customConnectStr: ''
        }
      }
      setIsOpen (flag){
        this.setState({
          isOpen:flag
        })
      }
    
       componentDidMount(){
                   
      }
    
      async openModal() {
        //Create Payment Intent
        this.setIsOpen(true);
      }
     
     
      closeModal(){
        this.setIsOpen(false);
      }

      setupCustomConnect = (e) => {
        if (!this.props.currentUserObj.stripeAccountId) {
          console.log('Create Custom Connect Account')
          apiClient.createCustomConnect()
          .then(rsp => {
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
              console.log('Url is %o', stripeRsp.url)
              this.setState({
                customConnectStr:stripeRsp.url,
                isCustom:true
              })
            })
        }

      }

      renderConnectOptions = () => {
        return (
          <div>
            <div className="sr-legal-text">
            This platform uses Stripe to get you paid quickly and keep your personal and payment information secure. Thousands of companies around the world trust Stripe to process payments for their users. Set up a Stripe account to get paid with this platform
            </div>
            <div className="submit-card-button" style={{marginTop:"4px"}}>
             <button className="btn--green" ><a className="btn--text" href={this.state.connectStr}>Lets' go &rarr;</a></button>
                                              
            </div>
            <div className="sr-legal-text">
            Use custom connect
            </div>
            <div className="submit-card-button" style={{marginTop:"4px"}}>
              <button className="btn--green" onClick={this.setupCustomConnect}>Setup custom</button>
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
          <button className="btn--green" ><a className="btn--text" href={this.state.customConnectStr}>Lets' go custom &rarr;</a></button>
                                            
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