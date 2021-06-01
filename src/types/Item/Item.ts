import Status from "./Status";
import Priority from "./Priority";
import State from "./State";

interface Item {
  uid: string,
  name: string,
  description: string,
  isOpen: boolean,
  isSelected: boolean,
  isTarget: boolean,
  status: Status,
  priority: Priority,
  children: Item[],
  state: State
}

export default Item;
