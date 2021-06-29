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

      case actionTypes.CHOOSE_ITEM:
        root.update({isTarget: false});
        root.find((action as ChooseItemAction).item).isTarget = true;
        break;

      case actionTypes.CREATE_ITEM:
        const createItemAct = action as CreateItemAction;
        root.find(createItemAct.parent)
          .create(createItemAct.attributes, createItemAct.position)
        break;

      case actionTypes.EDIT_ITEM:
        root.find((action as EditItemAction).item)
          .update({state: StateEnum.none}, {state: StateEnum.edit})[0]
          .state = StateEnum.edit;
        break;

      case actionTypes.SELECT_ITEM:
        root.find((action as SelectItemAction).item).isSelected = true;
        break;

      case actionTypes.UNSELECT_ITEMS:
        (action as UnselectItemsAction).items
          .forEach(item => root.find(item).isSelected = false)
        break;

      case actionTypes.COPY_ITEMS:
        copies = (action as CopyItemsAction).items
          .map(item => root.find(item))
          .map(item => item.clone().getItem())
        break;

      case actionTypes.CUT_ITEMS:
        copies = (action as CutItemsAction).items
          .map(item => root.find(item))
          .map(item => root.remove(item))
          .map(items => items[0].clone().getItem())
        break;

      case actionTypes.PAST_ITEMS:
        const pastItemAct = action as PastItemsAction;
        [...pastItemAct.items].reverse()
          .forEach(item => root
            .find(pastItemAct.parent)
            .create(item, pastItemAct.position)
          )
        break;

      case actionTypes.MOVE_UP:
        const targetUp = root.filter({isTarget: true})[0];
        const newTargetUp = (targetUp.prev || targetUp.parent);

        if (newTargetUp) {
          root.setTarget(newTargetUp);
        }

        break;

      case actionTypes.MOVE_DOWN:
        break;

      case actionTypes.MOVE_INSIDE:
        break;

      case actionTypes.MOVE_OUTSIDE:
        break;

      case actionTypes.CREATE_PREVIOUS:
        break;

      case actionTypes.CREATE_NEXT:
        break;

      case actionTypes.CREATE_CHILD:
        break;

      case actionTypes.REMOVE:
        break;

      case actionTypes.COPY:
        break;

      case actionTypes.CUT:
        break;

      case actionTypes.PAST:
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
