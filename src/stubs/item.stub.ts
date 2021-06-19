import Item from "../types/models/Item/Item";
import { v4 as uuid } from "uuid";

export const makeItemStub = (params = {}): Item => {
  const parent = Object.assign(
    {
      children: [] as Item[],
      uid: uuid(),
      name: '0',
      isTarget: false,
    },
    params,
  );

  parent.children = (parent.children as [])
    .map((child: Item, index) => makeItemStub(
      Object.assign(
        {
          name: `${parent.name}.${index}`
        },
        child
      )
    ));

  return parent as Item;
}
