import {
  ChooseItemAction, CopyAction,
  CopyItemsAction, CreateChildAction,
  CreateItemAction, CreateNextAction, CreatePreviousAction, CutAction,
  CutItemsAction,
  EditItemAction, MoveDownAction, MoveInsideAction, MoveOutsideAction, MoveUpAction, PastAction,
  PastItemsAction, RemoveAction,
  SelectItemAction,
  UnselectItemsAction
} from "./actions";
import Item from "../../types/models/Item/Item";
import actionTypes from "./action-types";
import ItemPartial from "../../types/models/Item/ItemPartial";

export const chooseItem = (item: Item): ChooseItemAction => ({
  type: actionTypes.CHOOSE_ITEM,
  item,
});
export const createItem = (parent: Item, attributes?: ItemPartial, position?: number): CreateItemAction => ({
  type: actionTypes.CREATE_ITEM,
  parent,
  attributes,
  position,
});
export const editItem = (item: Item): EditItemAction => ({
  type: actionTypes.EDIT_ITEM,
  item,
});
export const selectItem = (item: Item): SelectItemAction => ({
  type: actionTypes.SELECT_ITEM,
  item,
});
export const copyItems = (items: Item[]): CopyItemsAction => ({
  type: actionTypes.COPY_ITEMS,
  items,
});
export const cutItems = (items: Item[]): CutItemsAction => ({
  type: actionTypes.CUT_ITEMS,
  items,
});
export const unselectItems = (items: Item[]): UnselectItemsAction => ({
  type: actionTypes.UNSELECT_ITEMS,
  items,
});
export const pastItems = (parent: Item, items: Item[], position?: number): PastItemsAction => ({
  type: actionTypes.PAST_ITEMS,
  parent,
  items,
  position,
});

// General

export const moveUp = (): MoveUpAction => ({
  type: actionTypes.MOVE_UP,
})
export const moveDown = (): MoveDownAction => ({
  type: actionTypes.MOVE_DOWN,
})
export const moveInside = (): MoveInsideAction => ({
  type: actionTypes.MOVE_INSIDE,
})
export const moveOutside = (): MoveOutsideAction => ({
  type: actionTypes.MOVE_OUTSIDE,
})
export const createPrevious = (): CreatePreviousAction => ({
  type: actionTypes.CREATE_PREVIOUS,
})
export const createNext = (): CreateNextAction => ({
  type: actionTypes.CREATE_NEXT,
})
export const createChild = (): CreateChildAction => ({
  type: actionTypes.CREATE_CHILD,
})
export const remove = (): RemoveAction => ({
  type: actionTypes.REMOVE,
})
export const copy = (): CopyAction => ({
  type: actionTypes.COPY,
})
export const cut = (): CutAction => ({
  type: actionTypes.CUT,
})
export const past = (): PastAction => ({
  type: actionTypes.PAST,
})

const actionCreators = {
  // Base. Single item.
  chooseItem,
  createItem,
  editItem,
  selectItem,
  // Base. Multiple items.
  copyItems,
  cutItems,
  unselectItems,
  pastItems,
  // General.
  moveUp,
  moveDown,
  moveInside,
  moveOutside,
  createPrevious,
  createNext,
  createChild,
  remove,
  copy,
  cut,
  past,
}
export default actionCreators;
