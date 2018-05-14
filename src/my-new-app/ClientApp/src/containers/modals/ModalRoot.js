﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiErrorModal from './ApiErrorModal';
import AddToggleModal from './AddToggleModal';
import DeleteToggleModal from './DeleteToggleModal';
import './modal.css';

class ModalRoot extends Component {
  
  render() {
    if (!this.props.modalType) {
      return null;
    }
  
    const SpecificModal = MODAL_COMPONENTS[this.props.modalType]
    return <SpecificModal className='modal-container' {...this.props.modalProps} />
  }

}

const mapStateToProps = (state) => {
  return state.modal;
}

const MODAL_COMPONENTS = {
  'API_ERROR': ApiErrorModal,
  'ADD_TOGGLE': AddToggleModal,
  'DELETE_TOGGLE': DeleteToggleModal,
};

export default connect(
  mapStateToProps
)(ModalRoot);