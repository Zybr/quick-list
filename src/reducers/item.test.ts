import actionTypes from "../actions/item/action-types";
import item from "./item";
import {
  chooseItem,
  copyItems,
  createItem,
  cutItems,
  editItem, pastItems,
  selectItem,
  unselectItems
} from "../actions/item/action-creators";
import { makeItemStub } from "../stubs/item.stub";
import PriorityEnum from "../types/models/Item/Priority.enum";
import StateEnum from "../types/models/Item/State.enum";
import StatusEnum from "../types/models/Item/Status.enum";
import ItemState from "../types/states/ItemState";
import Item from "../types/models/Item/Item";
import { Action } from "../actions/item/actions";

describe("reducer 'item'", () => {
  let state: ItemState;
  const defaultAttributes = {
    children: [],
    description: "",
    isOpen: false,
    isSelected: false,
    isTarget: false,
    name: "Item",
    priority: PriorityEnum.low,
    state: StateEnum.none,
    status: StatusEnum.open,
  };
  let notExistedItem: Item;
  const position = 1;

  beforeEach(() => {
    state = {
      root: makeItemStub({
        children: [
          {
            children: [
              {},
            ]
          },
          {
            children: [
              {}, {}, {}
            ]
          }
        ],
        isTarget: true,
      }),
      copies: [],
      errors: [],
    };

    notExistedItem = makeItemStub();
  })

  describe(`${actionTypes.CHOOSE_ITEM_ACTION}`, () => {
    test('Positive', () => {
      const updState = item(state, chooseItem(state.root.children[1]));
      assertNoErrors(updState);

      state.root.isTarget = false;
      state.root.children[1].isTarget = true;
      expect(updState).toEqual(state);
    });

    test('Negative. Not found.', () => assertNotFoundError(item(state, chooseItem(notExistedItem))));

    test('Immutable', () => assertImmutableAction(state, () => chooseItem(state.root.children[1])));
  });

  describe(`${actionTypes.CREATE_ITEM_ACTION}`, () => {
    test("Positive", () => {
      const attributes = {
        uid: "eceed243-b0a5-416c-b48b-320d4fa80b96",
        name: "new",
      };

      const updState = item(state, createItem(state.root.children[1], attributes, position));
      assertNoErrors(updState);

      state.root.children[1].children.splice(position, 0, {
        ...defaultAttributes,
        ...attributes,
      });
      expect(updState).toEqual(state);
    });


    describe('Negative', () => {
      test("Duplicated UID", () => {
        const attributes = {uid: "eceed243-b0a5-416c-b48b-320d4fa80b96"};

        let updState = item(state, createItem(state.root.children[1], attributes, position));
        updState = item(updState, createItem(state.root.children[1], attributes, position));
        assertHasError(updState, 'already exists');

        state.root.children[1].children.splice(position, 0, {
          ...defaultAttributes,
          ...attributes,
        });
        expect(updState.root).toEqual(state.root);
      });

      test('Parent was not found', () => assertNotFoundError(item(state, chooseItem(notExistedItem))));
    });

    test('Immutable', () => assertImmutableAction(state, () => createItem(state.root.children[1], {}, position)));
  });

  describe(`${actionTypes.EDIT_ITEM_ACTION}`, () => {
    test('Positive', () => {
      let updState = item(state, editItem(state.root.children[0]));
      assertNoErrors(updState);

      state.root.children[0].state = StateEnum.edit;
      expect(updState).toEqual(state);

      updState = item(updState, editItem(state.root.children[1]));
      assertNoErrors(updState);

      state = clone(state);
      state.root.children[1].state = StateEnum.edit;
      expect(updState).toEqual(state);
    });

    test('Negative. Not found.', () => assertNotFoundError(item(state, editItem(notExistedItem))));

    test('Immutable', () => assertImmutableAction(state, () => editItem(state.root.children[1])));
  });

  describe(`${actionTypes.SELECT_ITEM_ACTION}`, () => {
    test('Positive', () => {
      let updState = item(state, selectItem(state.root.children[0]));
      assertNoErrors(updState);

      state.root.children[0].isSelected = true;
      expect(updState).toEqual(state);
    });

    test('Immutable', () => assertImmutableAction(state, () => selectItem(state.root.children[0])));

    test('Negative. Not found.', () => assertNotFoundError(item(state, selectItem(notExistedItem))));
  });


  describe(`${actionTypes.UNSELECT_ITEMS_ACTION}`, () => {
    test('Positive', () => {
      state.root.children.map(item => item.isSelected = true)

      let updState = item(state, unselectItems(state.root.children));
      assertNoErrors(updState);

      state.root.children.map(item => item.isSelected = false)
      expect(updState).toEqual(state);
    });

    test('Immutable', () => assertImmutableAction(state, () => unselectItems(state.root.children)));

    test('Negative. Not found.', () => assertNotFoundError(item(state, unselectItems([notExistedItem]))));
  });

  describe(`${actionTypes.COPY_ITEMS_ACTION}`, () => {
    test('Positive', () => {
      let updState = item(state, copyItems([state.root.children[0]]));
      assertNoErrors(updState);

      expect(updState.root).toEqual(state.root);
      state.copies = [{
        ...state.root.children[0],
        uid: null
      }]
      state.copies[0].children[0].uid = null
      expect(updState.copies).toEqual(state.copies);
    });

    test('Immutable', () => assertImmutableAction(state, () => copyItems(state.root.children)));

    test('Negative. Not found.', () => assertNotFoundError(item(state, copyItems([notExistedItem]))));
  });

  describe(`${actionTypes.CUT_ITEMS_ACTION}`, () => {
    test('Positive', () => {
      const target = state.root.children[0]
      let updState = item(state, cutItems([target]));
      assertNoErrors(updState);

      state.root.children.splice(0, 1);
      state.copies = [{
        ...clone(target),
        uid: null
      }]
      state.copies[0].children[0].uid = null
      expect(updState.copies).toEqual(state.copies);
      expect(updState.root).toEqual(state.root);
    });

    test('Immutable', () => assertImmutableAction(state, () => cutItems(state.root.children)));

    test('Negative. Not found.', () => assertNotFoundError(item(state, cutItems([notExistedItem]))));
  });

  describe(`${actionTypes.PAST_ITEMS_ACTION}`, () => {
    let parent: Item;
    let newItems: Item[];
    let position: number;

    beforeEach(() => {
      parent = state.root;
      newItems = [makeItemStub({...defaultAttributes}), makeItemStub({...defaultAttributes})];
      position = 1;
    });

    test('Positive', () => {
      let updState = item(state, pastItems(parent, newItems, position));
      assertNoErrors(updState);

      state.root.children.splice(position, 0, ...newItems)
      expect(updState).toEqual(state);
    });

    test('Immutable', () => assertImmutableAction(state, () => pastItems(parent, newItems, position)));

    test('Negative. Not found.', () => assertNotFoundError(item(state, pastItems(makeItemStub(), newItems, position))));
  });
});

declare interface CreateAction {
  (): Action
}

const clone = (state: {}) => JSON.parse(JSON.stringify(state));

const assertHasError = (state: ItemState, message: string) => {
  expect(state.errors.length).toBeGreaterThanOrEqual(1);
  expect(state.errors[0].message).toContain(message);
}

const assertImmutableAction = (state: ItemState, createAction: CreateAction) => {
  const stateBackup = clone(state);
  item(state, createAction());
  expect(stateBackup).toEqual(state);
}

const assertNoErrors = (state: ItemState) => {
  if (state.errors.length) {
    throw new Error(
      state.errors
        .map((error) => error.message)
        .join("\n")
    )
  }
}

const assertNotFoundError = (state: ItemState) => {
  expect(state.copies).toEqual([]);
  assertHasError(state, 'was not defined');
}
