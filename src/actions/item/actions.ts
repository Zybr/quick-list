import Item from "../../types/models/Item/Item";
import ItemPartial from "../../types/models/Item/ItemPartial";

export interface Action {
  readonly type: string;
}

// Base

// Base. Single item actions.

export interface ItemAction extends Action {
  readonly item: Item;
}

export interface CreateItemAction extends Action {
  readonly parent: Item
  readonly position?: number
  readonly attributes?: ItemPartial
}

export interface ChooseItemAction extends ItemAction {
}

export interface EditItemAction extends ItemAction {
}

export interface SelectItemAction extends ItemAction {
}

// Base. Item list actions

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
  readonly parent: Item
  readonly position?: number
}

// General

export interface MoveUpAction extends Action {
}

export interface MoveDownAction extends Action {
}

export interface MoveInsideAction extends Action {
}

export interface MoveOutsideAction extends Action {
}

export interface CreateNextAction extends Action {
}

export interface CreatePreviousAction extends Action {
}

export interface CreateChildAction extends Action {
}

export interface RemoveAction extends Action {
}

export interface CopyAction extends Action {
}

export interface CutAction extends Action {
}

export interface PastAction extends Action {
}
