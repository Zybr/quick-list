export const NONE_STATE = 'NONE_STATE';
export const EDIT_STATE = 'EDIT_STATE';

declare type State = typeof NONE_STATE | typeof EDIT_STATE;

export default State;
