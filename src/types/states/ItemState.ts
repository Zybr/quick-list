import Item from "../models/Item/Item";
import ItemCloned from "../models/Item/ItemCloned";

interface ItemState {
  root: Item,
  copies: ItemCloned[],
  errors: Error[],
}

export default ItemState
