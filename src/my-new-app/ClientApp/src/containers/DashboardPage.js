import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PageHeader } from 'react-bootstrap';
import { actionCreators } from '../actions/index';
import { getProjectList, getIsLoading } from '../store/Account';
import Projects from '../components/Projects';
import Audit from '../components/Audit';
import Loading from '../components/Loading';

class DashboardPage extends Component {
  componentWillMount() {
    this.props.requestProjects();
  }

  render() {
    if (!this.props.projects){
      return null;
    }

    if (this.props.isLoading){
      return(
        <Loading/>
      );
    }

    return (
      <div>
        <PageHeader>Dashboard</PageHeader>
        <Projects projects={this.props.projects}/>
        <Audit audit={this.props.audit} />   
      </div>
    ); 
  }
}

const mapStateToProps = (state) => {
  return {
    projects: getProjectList(state),
    isLoading: getIsLoading(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);