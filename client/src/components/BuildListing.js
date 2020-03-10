import React, { Component, useState } from 'react'
import axiosApi from '../api/axiosApi'
import { Menu, Dropdown, Grid } from 'semantic-ui-react'
import DatePicker from './DatePicker'
import apiClient from '../api/apiClient'
import data from "../api/db.json"

function validate (state) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = []

  if (state.title.length === 0) {
    errors.push('Title can not be empty')
  }

  if (state.details.length === 0) {
    errors.push('Details can not be empty')
  }

  if (state.startDate.length === 0) {
    errors.push('Date can not be empty')
  }

  if (state.location.length === 0) {
    errors.push('Location can not be empty')
  }

  state.images.map(image => {
    if (image === '') {
      errors.push('Images cannot be left empty')
    }
    return null
  })

  return errors
}

export default class BuildListing extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeImages = this.handleChangeImages.bind(this)
    this.handleChangeLocation = this.handleChangeLocation.bind(this)
    this.addNewImage = this.addNewImage.bind(this)
    this.renderImageCollection = this.renderImageCollection.bind(this)


    this.state = {
      errors: [],
      title: '',
      answer: 1,
      help: '',
      details: '',
      number: 1,
      result: '',
      numImages:1,
      images:[],
      startDate:'',
      endDate:'',
      location:''
    }
  }

  addNewImage (e) {
    console.log('Adding new images')
    this.setState(prevState => ({
      numImages:prevState.numImages+1
    }))
  }

  handleChangeTitle (e) {
    this.setState({
      title: e.target.value
    })
  }


  handleChangeDetails (e) {
    console.log('Details is %o', e.target.value)
    this.setState({
      details: e.target.value
    })
  }

  handleChangeDate (event,data) {
    console.log("Data value is %o", data)
    this.setState({
      startDate:data.value[0],
      endDate:data.value[1]
    })
  }

  handleChangeImages (e) {
    console.log("Before adding new image is %o", this.state.images)
    this.setState({
      images:[...this.state.images, e.target.value]
    })
  }

  handleChangeLocation (e) {
    this.setState({
      location:e.target.value
    })
  }


  componentDidMount () {
    if (Object.prototype.hasOwnProperty.call(this.props, 'id') && this.props.id) {
      const  id  = this.props.id
      console.log('Id is %o', id)
      /*
      var listing = data.listings.filter(listing => {
          if (listing.id === id) {
              return listing
          }
      })
      console.log("listing is %o", listing[0])
        this.setState({
          title: listing[0].title,
          details: listing[0].description,
          images: [listing[0].source],
          location: listing[0].location
        })
        */
       apiClient.getListing(id)
       .then (rsp => {
        console.log("listing is %o", rsp)
        this.setState({
          title: rsp.title,
          details: rsp.description,
          images: rsp.images,
          numImages: rsp.images.length,
          location: rsp.location
        })
       })
       .catch(err => {
         console.log("err in getting a listing with id %o", id)
       })
    } 
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('Submitting')
    const errors = validate(this.state)
    if (errors.length > 0) {
      this.setState({ errors })
      return
    }
    var newListing = {
      title: this.state.title,
      details: this.state.details,
      date: this.state.date,
      images: this.state.images,
      location: this.state.location
    }
    if (Object.prototype.hasOwnProperty.call(this.props, 'id') && this.props.id) {
      apiClient.updateListing(this.props.id, newListing)
      .then(res => {
        this.setState({ result: 'Successfully added listing' })
      }).catch(error => {
        console.log('Failed to add listing %o', error)
        this.setState({ result: `Listing Failed ${error}` })
      })
    } else {
      apiClient.createListing(newListing)
      .then(res => {
        this.setState({ result: 'Successfully added listing' })
      }).catch(error => {
        console.log('Failed to add listing %o', error)
        this.setState({ result: `Listing Failed ${error}` })
      })
    }
    if (!Object.prototype.hasOwnProperty.call(this.props, 'match')) {
      this.setState(prevState => ({
        errors: [],
        number: 0,
        title: '',
        location: '',
        images: [],
        details: '',
        numImages: 1,
        result: ''
      }))
    }
  }

  renderImageCollection () {
    var numImages = Array.apply(null, Array(this.state.numImages))
    console.log('Num images is %o & array is %o', this.state.numImages, numImages)
    let listItems = [];
    listItems = numImages.map((image, index) => (
                <Grid.Row>
                  <Grid.Column width={12}>
                    
                  <input className="form-control" type="url" name="url" id={index}
                                    placeholder="https://example.com"
                                    pattern="https://.*" size="30"
                                    required  
                                    onBlur ={this.handleChangeImages} 
                                    style={{width:"50%"}}
                                    />
                  </Grid.Column>
               </Grid.Row>

                ))
    return listItems;
  }

  renderSubmitButton () {
    if (Object.prototype.hasOwnProperty.call(this.props, 'match') && this.props.match.params.id) {
      return (
        <div className='form-group'>
          <input type='submit' value='Update Listing' onClick={this.handleSubmit} className='btn btn-primary' />
        </div>
      )
    } else {
      return (
        <div style={{textAlign: "center"}} className='form-group'>
          <input type='submit' value='Create Listing' onClick={this.handleSubmit} className='btn btn-half' />
        </div>
      )
    }
  }

  render () {
    return (
      <div style={{ marginTop: 10 }}>
          {this.state.errors.map((error, index) => (
            <p> <strong><font color='red' size='3' key={index}>Error: {error} </font></strong></p>
          ))}
          {this.state.result.length > 0 && this.state.result.includes('Success') &&
            <p> <strong><font color='green' size='3' key={this.state.result}>Result: {this.state.result} </font></strong></p>}
          {this.state.result.length > 0 && this.state.result.includes('Fail') &&
            <p> <strong><font color='red' size='3' key={this.state.result}>Result: {this.state.result} </font></strong></p>}
          <div className='form-group'>
            <Grid container>
             <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Title: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>

                  <input
                    type='text'
                    className='form-control'
                    value={this.state.title}
                    onChange={this.handleChangeTitle}
                    style={{width:"50%"}}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Details: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>

                  <textarea
                    className='form-control'
                    value={this.state.details}
                    placeholder='Description'
                    cols={40}
                    rows={10}
                    onChange={this.handleChangeDetails}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Dates:</strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>
                  <Menu compact>
                    <DatePicker handleChangeDate={this.handleChangeDate} type={"range"}/>
                  </Menu>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Location:</strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>
                  <input
                    type='text'
                    className='form-control'
                    value={this.state.location}
                    onChange={this.handleChangeLocation}
                    placeholder="Comma separated list of cities"
                    style={{width:"50%"}}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Helpful Image URLs: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>
                    <div>
                      {this.renderImageCollection()}
                    </div>
                   <div className="add-new-images"> <button><i className="plus icon" onClick={this.addNewImage}></i></button></div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          {this.renderSubmitButton()}
      </div>
    )
  }
}
