import _ from 'lodash';
import {
  START_FETCHING_DISCUSSIONS,
  STOP_FETCHING_DISCUSSIONS,
  FETCHING_DISCUSSIONS_SUCCESS,
  FETCHING_DISCUSSIONS_FAILURE,
  START_FETCHING_PINNED_DISCUSSIONS,
  STOP_FETCHING_PINNED_DISCUSSIONS,
  FETCHING_PINNED_DISCUSSIONS_SUCCESS,
  FETCHING_PINNED_DISCUSSIONS_FAILURE,
  UPDATE_SORTING_METHOD,
} from './constants';
import {
  fetchDiscussions,
  fetchPinnedDiscussions,
} from './api';

/**
 * find the id for current forum
 * @param  {Object} state   the state object
 * @param  {String} forum   current forum
 * @return {Number}         the forum id
 */
const findForumId = (state, forum) => {
  const { forums } = state.app;
  return _.find(forums, { forum_slug: forum })._id;
};

/**
 * action to fetch forum discussions
 * @param  {String}  forum               current forum slug
 * @param  {Boolean} feedChanged         if the feed has been changed, default is false
 * @param  {String}  sortingMethod       define the sorting method, default is 'date'
 * @param  {Boolean} sortingChanged      if user chagned the sorting method
 * @return {thunk}
 */
export const getDiscussions = (forum, feedChanged=false, sortingChanged=false) => {
  return (dispatch, getState) => {
    const forumId = findForumId(getState(), forum);
    const sortingMethod = getState().feed.sortingMethod;

    // show the loading message when user change forum or change sorting method
    if (feedChanged || sortingChanged) dispatch({ type: START_FETCHING_DISCUSSIONS });

    // start fetching discussions
    fetchDiscussions(forumId, sortingMethod).then(
      data => dispatch({ type: FETCHING_DISCUSSIONS_SUCCESS, payload: data.data }),
      error => dispatch({ type: FETCHING_DISCUSSIONS_FAILURE })
    );
  };
};

/**
 * action to fetch forum pinned discussions
 * @param  {String}  forum                current forum
 * @param  {Boolean} [feedChanged=false]  if the feed has been changed
 * @return {thunk}
 */
export const getPinnedDiscussions = (forum, feedChanged) => {
  return (dispatch, getState) => {
    const forumId = findForumId(getState(), forum);

    // show the loading message when user change forum
    if (feedChanged) dispatch({ type: START_FETCHING_PINNED_DISCUSSIONS });;

    // start fetching pinned discussions
    fetchPinnedDiscussions(forumId).then(
      data => dispatch({ type: FETCHING_PINNED_DISCUSSIONS_SUCCESS, payload: data.data }),
      error => dispatch({ type: FETCHING_PINNED_DISCUSSIONS_FAILURE })
    );
  };
};

/**
 * Update sorting method
 * @param  {String} method
 * @return {action}
 */
export const updateSortingMethod = (method) => {
  return { type: UPDATE_SORTING_METHOD, payload: method };
};
