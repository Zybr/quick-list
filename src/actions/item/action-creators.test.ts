import actionCreators from "./action-creators";
import actionTypes from "./action-types";
import faker from "faker";
import { makeItemStub } from "../../stubs/item.stub";

interface CreatorSet {
  creator: string,
  params: any[],
  result: {}
}

interface CreatorSetMaker {
  (): CreatorSet
}

declare type CreatorTestSet = CreatorSet | CreatorSetMaker;

describe('Item', () => {
  const item = makeItemStub();
  const items = [item]
  const actionSets = [
    {
      creator: 'chooseItem',
      params: [item],
      result: {
        type: actionTypes.CHOOSE_ITEM_ACTION,
        item,
      }
    },
    () => {
      const attributes = {
        name: faker.lorem.word()
      };
      const position = faker.datatype.number();
      return {
        creator: 'createItem',
        params: [item, attributes, position],
        result: {
          type: actionTypes.CREATE_ITEM_ACTION,
          parent: item,
          attributes,
          position,
        }
      }
    },
    {
      creator: 'editItem',
      params: [item],
      result: {
        type: actionTypes.EDIT_ITEM_ACTION,
        item,
      }
    },
    {
      creator: 'selectItem',
      params: [item],
      result: {
        type: actionTypes.SELECT_ITEM_ACTION,
        item,
      }
    },
    {
      creator: 'copyItems',
      params: [items],
      result: {
        type: actionTypes.COPY_ITEMS_ACTION,
        items,
      }
    },
    {
      creator: 'cutItems',
      params: [items],
      result: {
        type: actionTypes.CUT_ITEMS_ACTION,
        items,
      }
    },
    {
      creator: 'unselectItems',
      params: [items],
      result: {
        type: actionTypes.UNSELECT_ITEMS_ACTION,
        items,
      }
    },
    () => {
      const parent = item;
      const items = [makeItemStub(), makeItemStub()];
      const position = faker.datatype.number();
      return {
        creator: 'pastItems',
        params: [parent, items, position],
        result: {
          type: actionTypes.PAST_ITEMS_ACTION,
          parent,
          items,
          position,
        }
      }
    },
  ];

  actionSets.forEach((creatorSet: CreatorTestSet) => {
    const set: CreatorSet = (typeof creatorSet === 'function') ? creatorSet() : creatorSet;
    const creatorName: string = String(`${set.creator}`);
    // @ts-ignore
    const creator = actionCreators[creatorName];
    test(`${creatorName}`, () => expect(creator(...set.params)).toEqual(set.result))
  })
});
