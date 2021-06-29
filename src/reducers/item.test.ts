import actionTypes from "../actions/item/action-types";
import item from "./item";
import {
  chooseItem, copy, copyItems, createChild, createItem, createNext, createPrevious, cut, cutItems,
  editItem,
  moveDown, moveInside, moveOutside, moveUp,
  past, pastItems, remove,
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
      }),
      copies: [],
      errors: [],
    };

    notExistedItem = makeItemStub();
  })

  describe('Positive', () => {

    test(`${actionTypes.CHOOSE_ITEM}`, () => {
      const updState = item(state, chooseItem(state.root.children[1]));
      assertNoErrors(updState);

      state.root.isTarget = false;
      state.root.children[1].isTarget = true;
      expect(updState).toEqual(state);
    });

    test(`${actionTypes.CREATE_ITEM}`, () => {
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

    test(`${actionTypes.EDIT_ITEM}`, () => {
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

    test(`${actionTypes.SELECT_ITEM}`, () => {
      let updState = item(state, selectItem(state.root.children[0]));
      assertNoErrors(updState);

      state.root.children[0].isSelected = true;
      expect(updState).toEqual(state);
    });

    test(`${actionTypes.UNSELECT_ITEMS}`, () => {
      state.root.children.map(item => item.isSelected = true)

      let updState = item(state, unselectItems(state.root.children));
      assertNoErrors(updState);

      state.root.children.map(item => item.isSelected = false)
      expect(updState).toEqual(state);
    });

    test(`${actionTypes.COPY_ITEMS}`, () => {
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

    test(`${actionTypes.CUT_ITEMS}`, () => {
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

    test(`${actionTypes.PAST_ITEMS}`, () => {
      const newItems = [makeItemStub({...defaultAttributes}), makeItemStub({...defaultAttributes})];

      let updState = item(state, pastItems(state.root, newItems, position));
      assertNoErrors(updState);

      state.root.children.splice(position, 0, ...newItems)
      expect(updState).toEqual(state);
    });

    describe(`${actionTypes.MOVE_UP}`, () => {
      test(`Root`, () => {
        state.root.isTarget = true;

        let updState = item(state, moveUp());
        assertNoErrors(updState);

        expect(updState).toEqual(state);
      });

      test(`First`, () => {
        state.root.children[1].children[0].isTarget = true;

        let updState = item(state, moveUp());
        assertNoErrors(updState);

        state.root.children[1].children[0].isTarget = false;
        state.root.children[1].isTarget = true;
        expect(updState).toEqual(state);
      });

      test(`Not first`, () => {
        state.root.children[1].children[1].isTarget = true;

        let updState = item(state, moveUp());
        assertNoErrors(updState);

        state.root.children[1].children[0].isTarget = true;
        state.root.children[1].children[1].isTarget = false;
        expect(updState).toEqual(state);
      });
    });
  });

  describe('Negative', () => {
    test(`${actionTypes.CHOOSE_ITEM}. Not found.`, () => assertNotFoundError(item(state, chooseItem(notExistedItem))));
    describe(`${actionTypes.CREATE_ITEM}`, () => {
      test('Parent was not found', () => assertNotFoundError(item(state, createItem(notExistedItem))));
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
    });
    test(`${actionTypes.EDIT_ITEM}. Not found.`, () => assertNotFoundError(item(state, editItem(notExistedItem))));
    test(`${actionTypes.SELECT_ITEM}. Not found.`, () => assertNotFoundError(item(state, selectItem(notExistedItem))));
    test(`${actionTypes.UNSELECT_ITEMS}. Not found.`, () => assertNotFoundError(item(state, unselectItems([notExistedItem]))));
    test(`${actionTypes.COPY_ITEMS}. Not found.`, () => assertNotFoundError(item(state, copyItems([notExistedItem]))));
    test(`${actionTypes.CUT_ITEMS}. Not found.`, () => assertNotFoundError(item(state, cutItems([notExistedItem]))));
    test(`${actionTypes.PAST_ITEMS}. Not found.`, () => assertNotFoundError(item(state, pastItems(
      makeItemStub(),
      [makeItemStub({...defaultAttributes}), makeItemStub({...defaultAttributes})],
      position
    ))));
  });

  describe('Immutable', () => {
    test(`${actionTypes.CHOOSE_ITEM}`, () => assertImmutableAction(state, () => chooseItem(state.root.children[1])));
    test(`${actionTypes.CREATE_ITEM}`, () => assertImmutableAction(state, () => createItem(
      state.root.children[1],
      {},
      position
    )));
    test(`${actionTypes.EDIT_ITEM}`, () => assertImmutableAction(state, () => editItem(state.root.children[1])));
    test(`${actionTypes.SELECT_ITEM}`, () => assertImmutableAction(state, () => selectItem(state.root.children[0])));
    test(`${actionTypes.UNSELECT_ITEMS}`, () => assertImmutableAction(state, () => unselectItems(state.root.children)));
    test(`${actionTypes.COPY_ITEMS}`, () => assertImmutableAction(state, () => copyItems(state.root.children)));
    test(`${actionTypes.CUT_ITEMS}`, () => assertImmutableAction(state, () => cutItems(state.root.children)));
    test(`${actionTypes.PAST_ITEMS}`, () => assertImmutableAction(state, () => pastItems(
      state.root,
      [makeItemStub({...defaultAttributes}), makeItemStub({...defaultAttributes})],
      position
    )));
    test(`${actionTypes.MOVE_UP}`, () => assertImmutableAction(state, () => moveUp()))
    test(`${actionTypes.MOVE_DOWN}`, () => assertImmutableAction(state, () => moveDown()))
    test(`${actionTypes.MOVE_INSIDE}`, () => assertImmutableAction(state, () => moveInside()))
    test(`${actionTypes.MOVE_OUTSIDE}`, () => assertImmutableAction(state, () => moveOutside()))
    test(`${actionTypes.CREATE_PREVIOUS}`, () => assertImmutableAction(state, () => createPrevious()))
    test(`${actionTypes.CREATE_NEXT}`, () => assertImmutableAction(state, () => createNext()))
    test(`${actionTypes.CREATE_CHILD}`, () => assertImmutableAction(state, () => createChild()))
    test(`${actionTypes.REMOVE}`, () => assertImmutableAction(state, () => remove()))
    test(`${actionTypes.COPY}`, () => assertImmutableAction(state, () => copy()))
    test(`${actionTypes.CUT}`, () => assertImmutableAction(state, () => cut()))
    test(`${actionTypes.PAST}`, () => assertImmutableAction(state, () => past()))
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
