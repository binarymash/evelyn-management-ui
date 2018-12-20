﻿import produce from 'immer';
import {
  requestEnvironmentType,
  receiveEnvironmentType,
  receiveEnvironmentErrorType,
  requestEnvironmentStateType,
  receiveEnvironmentStateType,
  receiveEnvironmentStateErrorType,
  toggleStateUpdateSucceeded,
  toggleStateUpdateFailed
} from '../actions/index';

const getStoreKey = (projectId, environmentKey) => {
  let storeKey = `${projectId}/${environmentKey}`;
  return storeKey;
};

// Read

export const getIsEnvironmentLoading = (state, projectId, environmentKey) => {
  let storeKey = getStoreKey(projectId, environmentKey);
  return state.environment.environmentsLoading[storeKey] === true;
};

export const getIsEnvironmentStateLoading = (
  state,
  projectId,
  environmentKey
) => {
  let storeKey = getStoreKey(projectId, environmentKey);
  return state.environment.environmentStatesLoading[storeKey] === true;
};

export const getEnvironment = (state, projectId, environmentKey) => {
  let storeKey = getStoreKey(projectId, environmentKey);

  let environment = null;
  let environmentState = null;
  let project = null;

  let environmentProjection = state.environment.environments[storeKey];
  if (environmentProjection) {
    environment = environmentProjection.environment;
  }

  if (!environment) {
    return null;
  }

  let environmentStateProjection =
    state.environment.environmentStates[storeKey];
  if (environmentStateProjection) {
    environmentState = environmentStateProjection.environmentState;
  }

  let projectProjection = state.project.projects[projectId];
  if (projectProjection) {
    project = projectProjection.project;
  }

  return {
    key: environment.key,
    name: environment.name,
    toggles: getToggleStates(project, environmentState),
    audit: getAudit(environment, environmentState)
  };
};

const getToggleStates = (project, environmentState) => {
  if (!environmentState) {
    return [];
  }

  return environmentState.toggleStates.map(toggleState =>
    getToggleState(project, toggleState)
  );
};

const getToggleState = (project, toggleState) => {
  let name = toggleState.key;
  if (project) {
    let toggle = project.toggles.find(toggle => toggle.key === toggleState.key);
    if (toggle) {
      name = toggle.name;
    }
  }

  return {
    key: toggleState.key,
    name: name,
    value: getToggleStateValue(toggleState.value),
    version: toggleState.version
  };
};

const getToggleStateValue = value => {
  if (value === 'True') {
    return true;
  }

  if (value === 'False') {
    return false;
  }

  return null;
};

const getAudit = (environment, environmentState) => {
  if (!environment) {
    return null;
  }

  return {
    created: environment.audit.created,
    createdBy: environment.audit.createdBy,
    lastModified: environment.audit.lastModified,
    lastModifiedBy: environment.audit.lastModifiedBy
  };
};

// Write

const INITIAL_STATE = {
  environments: {},
  environmentsLoading: {},
  environmentStates: {},
  environmentStatesLoading: {}
};

export const reducer = produce((draft, action) => {
  switch (action.type) {
    case requestEnvironmentType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentsLoading[storeKey] = true;
      }
      break;

    case receiveEnvironmentType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentsLoading[storeKey] = undefined;
        draft.environments[storeKey] = action.json;
      }
      break;

    case receiveEnvironmentErrorType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentsLoading[storeKey] = undefined;
      }
      break;

    case requestEnvironmentStateType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentStatesLoading[storeKey] = true;
      }
      break;

    case receiveEnvironmentStateType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentStatesLoading[storeKey] = undefined;
        draft.environmentStates[storeKey] = action.json;
      }
      break;

    case receiveEnvironmentStateErrorType:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        draft.environmentStatesLoading[storeKey] = undefined;
      }
      break;

    case toggleStateUpdateSucceeded:
      {
        let storeKey = getStoreKey(action.projectId, action.environmentKey);
        let toggleState = draft.environmentStates[storeKey].toggleStates.find(
          ts => {
            return ts.key === action.toggleKey;
          }
        );
        toggleState.version = action.version;
        toggleState.value = action.value;
      }
      break;
  }
}, INITIAL_STATE);
