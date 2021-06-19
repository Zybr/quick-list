import {
  Action,
  ChooseItemAction, CopyItemsAction,
  CreateItemAction, CutItemsAction,
  EditItemAction, PastItemsAction,
  SelectItemAction,
  UnselectItemsAction
} from "../actions/item/actions";
import actionTypes from "../actions/item/action-types";
import ItemManager from "../services/Item/Manager";
import ItemState from "../types/states/ItemState";
import StateEnum from "../types/models/Item/State.enum";

export default function item(state: ItemState, action: Action | CreateItemAction): ItemState {
  const root = new ItemManager(clone(state?.root || {}));
  let copies = clone(state?.copies || []);
  const errors = clone(state?.errors || []);

  try {
    switch (action.type) {

      case actionTypes.CHOOSE_ITEM_ACTION:
        root.update({isTarget: false});
        root.find((action as ChooseItemAction).item).isTarget = true;
        break;

      case actionTypes.CREATE_ITEM_ACTION:
        const createAction = action as CreateItemAction;
        root.find(createAction.parent)
          .create(createAction.attributes, createAction.position,)
        break;

      case actionTypes.EDIT_ITEM_ACTION:
        root.find((action as EditItemAction).item)
          .update({state: StateEnum.none}, {state: StateEnum.edit})[0]
          .state = StateEnum.edit;
        break;

      case actionTypes.SELECT_ITEM_ACTION:
        root.find((action as SelectItemAction).item).isSelected = true;
        break;

      case actionTypes.UNSELECT_ITEMS_ACTION:
        (action as UnselectItemsAction).items
          .forEach(item => root.find(item).isSelected = false)
        break;

      case actionTypes.COPY_ITEMS_ACTION:
        copies = (action as CopyItemsAction).items
          .map(item => root.find(item))
          .map(item => item.clone().getItem())
        break;

      case actionTypes.CUT_ITEMS_ACTION:
        copies = (action as CutItemsAction).items
          .map(item => root.find(item))
          .map(item => root.remove(item))
          .map(items => items[0].clone().getItem())
        break;

      case actionTypes.PAST_ITEMS_ACTION:
        const pastAction = action as PastItemsAction;
        [...pastAction.items].reverse()
          .forEach(item => root
            .find(pastAction.parent)
            .create(item, pastAction.position)
          )
        break;

    }
  } catch (error: any) {
    errors.push(error);
  }

  return {
    root: root.getItem(),
    copies,
    errors,
  };
}

const clone = (state: {}) => JSON.parse(JSON.stringify(state));
