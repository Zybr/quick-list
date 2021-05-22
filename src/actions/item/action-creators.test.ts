import actionCreators from "./action-creators";
import { makeItem } from "./item.stub";
import actionTypes from "./action-types";
import faker from "faker";

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
  const item = makeItem();
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
      const order = faker.datatype.number();
      return {
        creator: 'createItem',
        params: [item, order],
        result: {
          type: actionTypes.CREATE_ITEM_ACTION,
          order,
          parent: item,
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
    {
      creator: 'pastItems',
      params: [items],
      result: {
        type: actionTypes.PAST_ITEMS_ACTION,
        items,
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