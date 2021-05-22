import Item from "../../types/Item/Item";

export interface Action {
  readonly type: string;
}

// Single item actions

export interface ItemAction extends Action {
  readonly item: Item;
}

export interface CreateItemAction extends Action {
  parent: Item
  order: number
}

export interface ChooseItemAction extends ItemAction {
}

export interface EditItemAction extends ItemAction {
}

export interface SelectItemAction extends ItemAction {
}

// Item list actions

export interface ItemsAction extends Action {
  readonly items: Item[];
}

export interface UnselectItemsAction extends ItemsAction {
}

export interface CopyItemsAction extends ItemsAction {
}

export interface CutItemsAction extends ItemsAction {
}

export interface PastItemsAction extends ItemsAction {
}

