﻿import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../actions/creators';
import { getProject, getIsLoading } from '../store/Project';
import Key from '../components/Key';
import Audit from '../components/Audit';
import PageLoading from '../components/PageLoading';
import Fade from '../services/transitions/fade.js';
import { motion, AnimatePresence } from 'framer-motion';

class ProjectPage extends Component {
  async componentDidMount() {
    await this.props.fetchProject(this.props.match.params.id);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id === this.props.match.params.id) {
      return;
    }

    await this.props.fetchProject(this.props.match.params.id);
  }

  render() {
    if (this.props.isLoading) {
      return <PageLoading />;
    }

    if (!this.props.project) {
      return null;
    }

    return (
      <AnimatePresence>
        <motion.div initial="initial" animate="in" exit="out" variants={Fade}>
          <h1>
            {this.props.project.name}
            <div>
              <small>
                <Key value={this.props.project.id} />
              </small>
            </div>
          </h1>

          <Audit audit={this.props.project.audit} />
        </motion.div>
      </AnimatePresence>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: getProject(state, ownProps.match.params.id),
    isLoading: getIsLoading(state, ownProps.match.params.id),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
