import Item from "../../types/Item/Item";
import { OPEN_STATUS } from "../../types/Item/Status";
import { LOW_PRIORITY } from "../../types/Item/Priority";
import { NONE_STATE } from "../../types/Item/State";
import ItemPartial from "../../types/Item/ItemPartial";
import { v4 as uuid } from "uuid";
import ItemDecorator from "./Decorator";

class ItemManager extends ItemDecorator {
  private readonly defaultParams = {
    uid: null,
    name: 'Item',
    description: '',
    isOpen: false,
    isSelected: false,
    isTarget: false,
    status: OPEN_STATUS,
    priority: LOW_PRIORITY,
    parent: null,
    children: [],
    state: NONE_STATE
  }

  get children(): ItemManager[] {
    return this.root.children.map(item => new ItemManager(item));
  }

  set children(items: ItemManager[]) {
    this.root.children = items.map(item => item.getItem());
  }

  public create(params: ItemPartial, position: number = Infinity): ItemManager {
    const newItem = Object.assign({}, this.defaultParams, params, {
      parent: this,
      uid: uuid()
    });

    this
      .root
      .children
      .splice(this.definePosition(position), 0, newItem);

    return new ItemManager(newItem);
  }

  public update(changes: {}, conditions: ItemPartial = {}): ItemManager[] {
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

  public find(item: Item): null | ItemManager {
    const foundItem = this
      .flatten()
      .find(innerItem => innerItem.uid === item.uid) as Item

    return foundItem ? new ItemManager(foundItem) : null;
  }

  public filter(conditions: ItemPartial): ItemManager[] {
    return this
      .flatten()
      .filter((item: ItemManager) => this.doesItFit(item, conditions))
  }

  private doesItFit(item: Item, conditions: Record<string, any>): boolean {
    return !Object.keys(conditions)
      .some((key: string) => conditions[key] !== (item as Record<string, any>)[key]);
  }

  private definePosition(position: number = Infinity) {
    position = position < 0 ? 0 : position;
    position = this.children.length < position ? this.children.length : position;

    return position;
  }

  private getParent(item: Item): null | ItemManager {
    return this.flatten()
      .find(innerItem => innerItem
        .children
        .find((child) => child.uid === item.uid)
      ) || null;
  }
}

export default ItemManager;
