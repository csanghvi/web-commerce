import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Modal from 'react-modal';
import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";


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
           connectStr:`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&state=testing&suggested_capabilities[]=card_payments&stripe_user[email]=${this.props.currentUserObj.email}`
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


      render() {
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
                <div>
                    <div className="sr-legal-text">
                        Want to setup your account?
                    </div>
                    <div className="submit-card-button">
                    <button className="btn--green" ><a className="btn--text" href={this.state.connectStr}>Lets' go &rarr;</a></button>
                                                       
                    </div>
                </div>
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