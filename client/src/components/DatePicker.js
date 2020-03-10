import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import React, { Component, useState } from 'react'

var FormData = require('form-data')


 const DatePicker = (props) => {
    const [currentDate, setNewDate] = useState(null);
    //const onChange = (event, data) => setNewDate(data.value);
   
    return <SemanticDatepicker  onChange={props.handleChangeDate} type={props.type}/>;
  };

  export default DatePicker

