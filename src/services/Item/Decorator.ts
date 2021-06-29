import Item from "../../types/models/Item/Item";
import State from "../../types/models/Item/State.enum";
import StatusEnum from "../../types/models/Item/Status.enum";
import PriorityEnum from "../../types/models/Item/Priority.enum";

abstract class ItemDecorator implements Item {
  protected readonly item: Item;

  constructor(item: Item) {
    this.item = item instanceof ItemDecorator ? item.getItem() : item;
  }

  public getItem(): Item {
    return this.item;
  }

  get uid(): null | string {
    return this.item.uid;
  }

  set uid(uid) {
    this.item.uid = uid;
  }

  get name(): string {
    return this.item.name;
  }

  set name(name) {
    this.item.name = name;
  }

  get description(): string {
    return this.item.description;
  }

  set description(description) {
    this.item.description = description;
  }

  get isOpen(): boolean {
    return this.item.isOpen;
  }

  set isOpen(isOpen) {
    this.item.isOpen = isOpen;
  }

  get isSelected(): boolean {
    return this.item.isSelected;
  }

  set isSelected(isSelected) {
    this.item.isSelected = isSelected;
  }

  get isTarget(): boolean {
    return this.item.isTarget;
  }

  set isTarget(isTarget) {
    this.item.isTarget = isTarget;
  }

  get status(): StatusEnum {
    return this.item.status;
  }

  set status(status) {
    this.item.status = status;
  }

  get priority(): PriorityEnum {
    return this.item.priority;
  }

  set priority(priority) {
    this.item.priority = priority;
  }

  get state(): State {
    return this.item.state;
  }

  set state(state) {
    this.item.state = state;
  }

  abstract get children(): ItemDecorator[];

  abstract set children(Items: ItemDecorator[]);
}

export default ItemDecorator;
