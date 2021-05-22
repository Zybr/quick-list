import Status from "./Status";
import Priority from "./Priority";
import NoneState from "./States/NoneState";

interface Item {
  name: string,
  description: string,
  order: number,
  isOpen: boolean,
  isSelected: boolean,
  status: Status,
  priority: Priority,
  parent: null | Item,
  children: Item[],
  state: NoneState
}

export default Item;
