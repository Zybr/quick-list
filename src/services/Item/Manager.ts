import Item from "../../types/models/Item/Item";
import ItemPartial from "../../types/models/Item/ItemPartial";
import { v4 as uuid } from "uuid";
import ItemDecorator from "./Decorator";
import PriorityEnum from "../../types/models/Item/Priority.enum";
import StateEnum from "../../types/models/Item/State.enum";
import StatusEnum from "../../types/models/Item/Status.enum";
import ItemIdentifier from "../../types/models/Item/ItemIdentifier";

class ItemManager extends ItemDecorator {
  private readonly defaultAttributes = {
    uid: null,
    name: 'Item',
    description: '',
    isOpen: false,
    isSelected: false,
    isTarget: false,
    status: StatusEnum.open,
    priority: PriorityEnum.low,
    children: [],
    state: StateEnum.none
  }

  private readonly root: Item;

  constructor(item: Item, root: null | Item = null) {
    super(item);
    this.root = null === root ? item : root;
  }

  get order(): number {
    return this.isRoot
      ? 0
      : this.parent
        ?.children
        ?.map(child => child.getItem())
        .indexOf(this.getItem()) as number;
  }

  get isRoot(): boolean {
    return null === this.parent
  }

  get isFirst(): boolean {
    return 0 === this.order;
  }

  get isLast(): boolean {
    return !this.parent || this.parent.children.length === this.order + 1;
  }

  get parent(): null | ItemManager {
    return this.getParent(this);
  }

  get next(): null | ItemManager {
    return this.parent?.children[this.order + 1] || null;
  }

  get prev(): null | ItemManager {
    return this.parent?.children[this.order - 1] || null;
  }

  get children(): ItemManager[] {
    return this.item.children.map(item => new ItemManager(item, this.root));
  }

  set children(items: ItemManager[]) {
    this.item.children = items.map(item => item.getItem());
  }

  public create(attributes: ItemPartial = {}, position: number = Infinity): ItemManager {
    const newItem = Object.assign({},
      this.defaultAttributes,
      {uid: uuid()},
      attributes,
    );

    if (this.has(ItemManager.getIdentifier(attributes))) {
      throw new Error(`An item with UID "${attributes.uid}" already exists.`);
    }

    this.item
      .children
      .splice(this.definePosition(position), 0, newItem);

    return new ItemManager(newItem, this.root);
  }

  public clone(): ItemManager {
    const itemMng = new ItemManager(
      JSON.parse(JSON.stringify(this.item)),
      JSON.parse(JSON.stringify(this.root)),
    )
    itemMng.update({uid: null});

    return itemMng;
  }

  public update(changes: ItemPartial, conditions: ItemPartial = {}): ItemManager[] {
    return this
      .filter(conditions)
      .map((item: ItemManager) => Object.assign(item, changes))
  }

  public forEach(
    handle: {
      (item: Item, index: number): void
    },
    conditions: ItemPartial = {}
  ): ItemManager[] {
    return this
      .filter(conditions)
      .map((item: ItemManager, index) => {
        handle(item, index);
        return item
      })
  }

  public remove(conditions: ItemPartial = {}): ItemManager[] {
    return this
      .filter(conditions)
      .map((item: ItemManager) => {
          return item.parent
            ? item
              .parent
              .getItem()
              .children
              .splice(
                item.parent
                  .children
                  .map(child => child.uid)
                  .indexOf(item.uid),
                1,
              )
              .shift()
            : null
        }
      )
      .filter(item => !!item)
      .map(item => new ItemManager(item as Item, this.root))
  }

  public flatten(): ItemManager[] {
    return [this.item]
      .concat(
        ...this.item.children.map(
          child => (new ItemManager(child, this.root)).flatten()
        )
      )
      .map((item: Item) => new ItemManager(item, this.root));
  }

  public find(id: ItemIdentifier): ItemManager {
    if (!this.has(ItemManager.getIdentifier(id))) {
      throw new Error(`Item with UID "${id?.uid}" was not defined.`);
    }

    return this.filter(ItemManager.getIdentifier(id))[0];
  }

  public has(id: ItemIdentifier): boolean {
    return !!this.filter(ItemManager.getIdentifier(id)).length
  }

  public filter(conditions: ItemPartial | FilterFunction): ItemManager[] {
    return this
      .flatten()
      .filter((item: ItemManager) => this.doesItFit(item, conditions))
  }

  public gegTarget(): null | ItemManager {
    const targets = this.filter({isTarget: true});
    if (targets.length > 1) {
      throw new Error('There are several targets: ' + targets.map(target => target.uid).join(', '));
    }

    return targets[0] || null;
  }

  public setTarget(item: null | ItemManager) {
    const root = new ItemManager(this.root);
    root.update({isTarget: false});

    if (item) {
      root.find(item).isTarget = true;
    }
  }

  private getParent(item: Item): null | ItemManager {
    return new ItemManager(this.root)
      .flatten()
      .filter(innerItem => innerItem
        .children
        .find((child) => child.uid === item.uid)
      )[0] || null;
  }

  private definePosition(position: number = Infinity) {
    position = position < 0 ? 0 : position;
    position = this.children.length < position ? this.children.length : position;

    return position;
  }

  private static getIdentifier(identifier: ItemIdentifier): ItemIdentifier {
    return {uid: identifier?.uid}
  }

  private doesItFit(item: Item, conditions: Record<string, any>): boolean {
    conditions = conditions instanceof ItemManager ? conditions.getItem() : conditions;
    conditions = conditions.uid ? {uid: conditions.uid} : conditions;

    return !Object.keys(conditions)
      .some((key: string) => conditions[key] !== (item as Record<string, any>)[key]);
  }
}

interface FilterFunction {
  (item: Item): boolean
}

export default ItemManager;
