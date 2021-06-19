import {
  ChooseItemAction,
  CopyItemsAction,
  CreateItemAction,
  CutItemsAction,
  EditItemAction,
  PastItemsAction,
  SelectItemAction,
  UnselectItemsAction
} from "./actions";
import Item from "../../types/models/Item/Item";
import actionTypes from "./action-types";
import ItemPartial from "../../types/models/Item/ItemPartial";

export const chooseItem = (item: Item): ChooseItemAction => ({
  type: actionTypes.CHOOSE_ITEM_ACTION,
  item,
});
export const createItem = (parent: Item, attributes?: ItemPartial, position?: number): CreateItemAction => ({
  type: actionTypes.CREATE_ITEM_ACTION,
  parent,
  attributes,
  position,
});
export const editItem = (item: Item): EditItemAction => ({
  type: actionTypes.EDIT_ITEM_ACTION,
  item,
});
export const selectItem = (item: Item): SelectItemAction => ({
  type: actionTypes.SELECT_ITEM_ACTION,
  item,
});

export const copyItems = (items: Item[]): CopyItemsAction => ({
  type: actionTypes.COPY_ITEMS_ACTION,
  items,
});
export const cutItems = (items: Item[]): CutItemsAction => ({
  type: actionTypes.CUT_ITEMS_ACTION,
  items,
});
export const unselectItems = (items: Item[]): UnselectItemsAction => ({
  type: actionTypes.UNSELECT_ITEMS_ACTION,
  items,
});
export const pastItems = (parent: Item, items: Item[], position?: number): PastItemsAction => ({
  type: actionTypes.PAST_ITEMS_ACTION,
  parent,
  items,
  position,
});

const actionCreators = {
  // Single item
  chooseItem,
  createItem,
  editItem,
  selectItem,
  // Multiple items
  copyItems,
  cutItems,
  unselectItems,
  pastItems,
}
export default actionCreators;
