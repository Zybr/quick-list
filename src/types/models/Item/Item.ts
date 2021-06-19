import PriorityEnum from "./Priority.enum";
import StateEnum from "./State.enum";
import StatusEnum from "./Status.enum";

interface Item {
  uid: null | string,
  name: string,
  description: string,
  isOpen: boolean,
  isSelected: boolean,
  isTarget: boolean,
  status: StatusEnum,
  priority: PriorityEnum,
  children: Item[],
  state: StateEnum
}

export default Item;
