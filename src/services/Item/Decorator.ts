import Item from "../../types/Item/Item";
import Status from "../../types/Item/Status";
import Priority from "../../types/Item/Priority";
import State from "../../types/Item/State";

abstract class ItemDecorator implements Item {
  protected readonly root: Item;

  constructor(root: Item) {
    this.root = root instanceof ItemDecorator ? root.getItem() : root;
  }

  public getItem(): Item {
    return this.root;
  }

  get uid(): string {
    return this.root.uid;
  }

  get name(): string {
    return this.root.name;
  }

  set name(name) {
    this.root.name = name;
  }

  get description(): string {
    return this.root.description;
  }

  set description(description) {
    this.root.description = description;
  }

  get isOpen(): boolean {
    return this.root.isOpen;
  }

  set isOpen(isOpen) {
    this.root.isOpen = isOpen;
  }

  get isSelected(): boolean {
    return this.root.isSelected;
  }

  set isSelected(isSelected) {
    this.root.isSelected = isSelected;
  }

  get isTarget(): boolean {
    return this.root.isTarget;
  }

  set isTarget(isTarget) {
    this.root.isTarget = isTarget;
  }

  get status(): Status {
    return this.root.status;
  }

  set status(status) {
    this.root.status = status;
  }

  get priority(): Priority {
    return this.root.priority;
  }

  set priority(priority) {
    this.root.priority = priority;
  }

  get state(): State {
    return this.root.state;
  }

  set state(state) {
    this.root.state = state;
  }

  abstract get children(): ItemDecorator[];

  abstract set children(Items: ItemDecorator[]);
}

export default ItemDecorator;
