import PriorityEnum from "./Priority.enum";
import StatusEnum from "./Status.enum";
import StateEnum from "./State.enum";

interface ItemPartial {
  uid?: null | string,
  name?: string,
  description?: string,
  isOpen?: boolean,
  isSelected?: boolean,
  isTarget?: boolean,
  status?: StatusEnum,
  priority?: PriorityEnum,
  children?: ItemPartial[],
  state?: StateEnum
}

export default ItemPartial;
