export const LOW_PRIORITY = 'LOW_PRIORITY';
export const MIDDLE_PRIORITY = 'MIDDLE_PRIORITY';
export const HIGH_PRIORITY = 'HIGH_PRIORITY';

declare type Priority = typeof LOW_PRIORITY | typeof MIDDLE_PRIORITY | typeof HIGH_PRIORITY;

export default Priority;
