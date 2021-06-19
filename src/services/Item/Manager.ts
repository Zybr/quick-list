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

  get children(): ItemManager[] {
    return this.root.children.map(item => new ItemManager(item));
  }

  set children(items: ItemManager[]) {
    this.root.children = items.map(item => item.getItem());
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

    this.root
      .children
      .splice(this.definePosition(position), 0, newItem);

    return new ItemManager(newItem);
  }

  public clone(): ItemManager {
    const itemMng = new ItemManager(
      Object.assign({}, this.getItem(), {
        uid: null
      })
    );
    itemMng.children = itemMng.children
      .map(itemMng => itemMng.clone());

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
          const parent = this.getParent(item);

          return parent
            ? parent.getItem()
              .children
              .splice(
                parent
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
      .map(item => new ItemManager(item as Item))
  }

  public flatten(): ItemManager[] {
    return [this.root]
      .concat(
        ...this.root.children.map(
          child => (new ItemManager(child)).flatten()
        )
      )
      .map((item: Item) => new ItemManager(item));
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

  private getParent(item: Item): null | ItemManager {
    return this.flatten()
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
