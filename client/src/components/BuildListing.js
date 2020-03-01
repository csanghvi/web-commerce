import React, { Component, useState } from 'react'
import axiosApi from '../api/axiosApi'
import { Menu, Dropdown, Grid } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

var FormData = require('form-data')


const AppWithBasic = () => {
    const [currentDate, setNewDate] = useState(null);
    const onChange = (event, data) => setNewDate(data.value);
   
    return <SemanticDatepicker  onChange={onChange} />;
  };

const ddcontenttype = [
  { key: 1, text: 'Onboarding', value: 'onboarding' }
]

function validate (state) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = []

  if (state.question.length === 0) {
    errors.push('Question can not be empty')
  }
  state.options.map(option => {
    if (option === '') {
      errors.push('Options cannot be left empty')
    }
    return null
  })

  if (state.help.length === 0) {
    errors.push('Help cannot be empty')
  }
  return errors
}

export default class CreateQuizContent extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeQuestion = this.handleChangeQuestion.bind(this)
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this)
    this.handleChangeOptions = this.handleChangeOptions.bind(this)
    this.handleChangeHelp = this.handleChangeHelp.bind(this)
    this.handleChangeFeedback = this.handleChangeFeedback.bind(this)
    this.handleContentTypeChange = this.handleContentTypeChange.bind(this)

    this.state = {
      errors: [],
      question: '',
      options: ['', '', ''],
      answer: 1,
      help: '',
      feedback: '',
      number: 1,
      result: ''
    }
  }

  handleChangeQuestion (e) {
    this.setState({
      question: e.target.value
    })
  }

  handleChangeHelp (e) {
    this.setState({
      help: e.target.value
    })
  }

  handleChangeFeedback (e) {
    this.setState({
      feedback: e.target.value
    })
  }

  handleChangeAnswer (e, { value }) {
    console.log('Value of answe is %o', value)
    this.setState({
      answer: Number(value)
    })
  }

  handleChangeOptions (e) {
    const { name, value } = e.target
    const { options } = this.state
    console.log('key of content is %o & value is %o', name, value)
    options[name] = value
    this.setState({
      options
    })
  }

  handleContentTypeChange (e, data) {
    this.setState({
      contentType: data.value
      // content:updated
    })
  }

  componentDidMount () {
    if (Object.prototype.hasOwnProperty.call(this.props, 'match') && this.props.match.params.id) {
      axiosApi.get(`quiz/${this.props.match.params.id}`).then(response => {
        console.log('Response received is %o', response)
        this.setState({
          question: JSON.stringify(response.data.question),
          answer: response.data.answer - 1,
          help: response.data.help,
          contentType: response.data.contentType,
          feedback: response.data.feedback,
          options: response.data.options
        })
      }).catch(error => { console.log(error) })
    } else {
      axiosApi.get('quiz/').then(response => {
        if (Object.prototype.hasOwnProperty.call(response.data, 'status') && !response.data.status) {
          this.setState({
            result: response.data.error
          })
        } else {
          this.setState({
            number: response.data.length + 1
          })
        }
      }).catch(error => { console.log(error) })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const errors = validate(this.state)
    if (errors.length > 0) {
      this.setState({ errors })
      return
    }

    const data = new FormData()

    var newQuestion = {
      question: JSON.parse(this.state.question),
      options: this.state.options,
      help: this.state.help,
      feedback: this.state.feedback,
      contentType: this.state.contentType,
      answer: this.state.answer + 1,
      number: this.state.number
    }

    data.append('quiz', JSON.stringify(newQuestion))
    if (Object.prototype.hasOwnProperty.call(this.props, 'match') && this.props.match.params.id) {
      axiosApi.post('quiz/update/' + this.props.match.params.id, data).then(res => {
        if (Object.prototype.hasOwnProperty.call(res.data, 'status') && !res.data.status) {
          this.setState({ result: res.data.error })
        }
        this.setState({ result: 'Successfully updated question' })
      }).catch(error => {
        console.log('Failed to add Question %o', error)
        this.setState({ result: `Question Failed ${error}` })
      })
    } else {
      axiosApi.post('quiz/add', data).then(res => {
        this.setState({ result: 'Successfully added question' })
      }).catch(error => {
        console.log('Failed to add question %o', error)
        this.setState({ result: `Question Failed ${error}` })
      })
    }
    if (!Object.prototype.hasOwnProperty.call(this.props, 'match')) {
      this.setState(prevState => ({
        errors: [],
        number: 0,
        help: '',
        feedback: '',
        contentType: '',
        question: '',
        answer: 1,
        options: ['', '', ''],
        result: ''
      }))
    }
  }

  renderSubmitButton () {
    if (Object.prototype.hasOwnProperty.call(this.props, 'match') && this.props.match.params.id) {
      return (
        <div className='form-group'>
          <input type='submit' value='Update Question' className='btn btn-primary' />
        </div>
      )
    } else {
      return (
        <div className='form-group'>
          <input type='submit' value='Create Question' className='btn btn-primary' />
        </div>
      )
    }
  }

  render () {
    return (
      <div style={{ marginTop: 10 }}>
        <form onSubmit={this.handleSubmit}>
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
                  <label><strong>Event Title: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>

                  <input
                    type='text'
                    className='form-control'
                    value={this.state.feedback}
                    onChange={this.handleChangeFeedback}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Event Details: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>

                  <textarea
                    className='form-control'
                    value={this.state.question}
                    placeholder='Copy JSON object from Slack Block Kit builder'
                    cols={40}
                    rows={10}
                    onChange={this.handleChangeQuestion}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Type of content:</strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>
                  <Menu compact>
                    <AppWithBasic />
                  </Menu>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} textAlign='right'>
                  <label><strong>Helpful Images: </strong> </label>
                </Grid.Column>
                <Grid.Column width={12}>

                <div>
              {this.state.result.length > 0 &&
                <p> <strong><font color='green' size="3" key={this.state.result}>Result: {this.state.result} </font></strong></p>
              }
                <input type="file" name="Add Images" id="" onChange={this.onUpload} multiple />
                <button onClick={this.onSubmit}>Upload</button>
              </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          {this.renderSubmitButton()}
        </form>
      </div>
    )
  }
}
