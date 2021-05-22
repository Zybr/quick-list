export const OPEN_STATUS = 'OPEN_STATUS';
export const IN_PROGRESS_STATUS = 'IN_PROGRESS_STATUS';
export const DONE_STATUS = 'DONE_STATUS';

declare type Status = typeof OPEN_STATUS | typeof IN_PROGRESS_STATUS | typeof DONE_STATUS;

export default Status;
