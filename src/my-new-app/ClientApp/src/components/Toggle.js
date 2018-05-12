﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class Toggle extends Component {

  render() {
    return(
      <ListGroupItem>
        <Link to={`/projects/${this.props.toggle.projectId}/toggles/${this.props.toggle.key}`} >{this.props.toggle.name}</Link>    
      </ListGroupItem>
    ); 
  } 
}

export default connect(
)(Toggle);
