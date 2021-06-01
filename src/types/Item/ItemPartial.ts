import Status from "./Status";
import Priority from "./Priority";
import State from "./State";

interface ItemPartial {
  uid?: string,
  name?: string,
  description?: string,
  isOpen?: boolean,
  isSelected?: boolean,
  isTarget?: boolean,
  status?: Status,
  priority?: Priority,
  children?: ItemPartial[],
  state?: State
}

export default ItemPartial;
