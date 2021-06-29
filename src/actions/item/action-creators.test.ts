import actionCreators from "./action-creators";
import actionTypes from "./action-types";
import faker from "faker";
import { makeItemStub } from "../../stubs/item.stub";
import { Action } from "./actions";

interface CreatorSet {
  creator: string,
  params: any[],
  result: Action,
}

interface CreatorSetMaker {
  (): CreatorSet
}

declare type CreatorTestSet = CreatorSet | CreatorSetMaker;

describe('Item', () => {
  const item = makeItemStub();
  const items = [item]
  const actionSets = [
    () => {
      const attributes = {
        name: faker.lorem.word()
      };
      const position = faker.datatype.number();
      return {
        creator: 'createItem',
        params: [item, attributes, position],
        result: {
          type: actionTypes.CREATE_ITEM,
          parent: item,
          attributes,
          position,
        }
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
          type: actionTypes.PAST_ITEMS,
          parent,
          items,
          position,
        }
      }
    },
    ...[
      ['chooseItem', [item], {type: actionTypes.CHOOSE_ITEM, item}],
      ['editItem', [item], {type: actionTypes.EDIT_ITEM, item}],
      ['selectItem', [item], {type: actionTypes.SELECT_ITEM, item}],
      ['copyItems', [items], {type: actionTypes.COPY_ITEMS, items}],
      ['cutItems', [items], {type: actionTypes.CUT_ITEMS, items}],
      ['unselectItems', [items], {type: actionTypes.UNSELECT_ITEMS, items}],
      ['moveUp', [], {type: actionTypes.MOVE_UP}],
      ['moveDown', [], {type: actionTypes.MOVE_DOWN}],
      ['moveInside', [], {type: actionTypes.MOVE_INSIDE}],
      ['moveOutside', [], {type: actionTypes.MOVE_OUTSIDE}],
      ['createPrevious', [], {type: actionTypes.CREATE_PREVIOUS}],
      ['createNext', [], {type: actionTypes.CREATE_NEXT}],
      ['createChild', [], {type: actionTypes.CREATE_CHILD}],
      ['remove', [], {type: actionTypes.REMOVE}],
      ['copy', [], {type: actionTypes.COPY}],
      ['cut', [], {type: actionTypes.CUT}],
      ['past', [], {type: actionTypes.PAST}],
    ]
      .map((params): CreatorTestSet => ({
        creator: params[0] as string,
        params: params[1] as [],
        result: params[2] as Action,
      }))
  ];

  actionSets.forEach((creatorSet: CreatorTestSet) => {
    const set: CreatorSet = (typeof creatorSet === 'function') ? creatorSet() : creatorSet;
    const creatorName: string = String(`${set.creator}`);
    // @ts-ignore
    const creator = actionCreators[creatorName];
    test(`${creatorName}`, () => expect(creator(...(set.params || []))).toEqual(set.result))
  })
});
