import { Action, ItemAction } from "../actions/item/actions";
import actionTypes from "../actions/item/action-types";
import Item from "../types/Item/Item";
import ItemManager from "../services/Item/Manager";

export default function item(state: Item, action: Action): Item {
  const root = new ItemManager(Object.assign({}, state));

  switch (action.type) {
    case actionTypes.CHOOSE_ITEM_ACTION:
      root.forEach(item => item.isTarget = false)
      root.update({isTarget: true}, (action as ItemAction).item)
      break;
    case actionTypes.CREATE_ITEM_ACTION:
      root.forEach(item => item.isTarget = false)
      root.update({isTarget: true}, (action as ItemAction).item)
      break;
    case actionTypes.EDIT_ITEM_ACTION:
      break;
    case actionTypes.SELECT_ITEM_ACTION:
      break;
    case actionTypes.UNSELECT_ITEMS_ACTION:
      break;
    case actionTypes.COPY_ITEMS_ACTION:
      break;
    case actionTypes.CUT_ITEMS_ACTION:
      break;
    case actionTypes.PAST_ITEMS_ACTION:
      break;
    default:
    // throw new Error(`Action ${action.type} is not processed`);
  }

  return root.getItem();
}
