import actionTypes from "../actions/item/action-types";
import item from "./item";
import { chooseItem } from "../actions/item/action-creators";
import { makeItemStub } from "../stubs/item.stub";
import Item from "../types/Item/Item";

describe("reducer 'item'", () => {
  let srcState: Item;

  beforeEach(() => {
    srcState = makeItemStub({
      children: [
        {},
        {}
      ]
    });
  })

  test(`${actionTypes.CHOOSE_ITEM_ACTION}`, () => {
    const updState =  item(
      srcState,
      chooseItem(srcState.children[1])
    );

    expect(updState).toBeDefined();
  });
});
