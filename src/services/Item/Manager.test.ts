import { makeItemStub } from "../../stubs/item.stub";
import Manager from "./Manager";
import ItemManager from "./Manager";
import Item from "../../types/models/Item/Item";

describe("ItemManager", () => {
  let itemMng: Manager;
  const rootTemplate = {
    children: [
      {
        children: [
          {
            children: [{}]
          }
        ]
      },
      {
        children: [
          {
            children: [{}]
          }
        ]
      },
    ]
  };

  beforeEach(() => {
    itemMng = new Manager(makeItemStub(rootTemplate));
  })

  test('.isRoot', () => {
    expect(new Manager(makeItemStub()).isRoot).toBeTruthy();

    expect(new Manager(makeItemStub({
      children: [{}]
    })).children[0].isRoot).toBeFalsy();
  })

  test('.isFirst', () => {
    expect(itemMng.isFirst).toBeTruthy();
    expect(itemMng.children[0].isFirst).toBeTruthy();
    expect(itemMng.children[1].isFirst).toBeFalsy();
  })

  test('.isLast', () => {
    expect(itemMng.isLast).toBeTruthy();
    expect(itemMng.children[0].isLast).toBeFalsy();
    expect(itemMng.children[1].isLast).toBeTruthy();
  })

  test('.order', () => {
    expect(new Manager(makeItemStub({})).order).toEqual(0);
    expect(itemMng.children[1].order).toEqual(1);
  })

  test('.parent', () => {
    expect(new Manager(makeItemStub()).parent).toBeNull();

    const state = makeItemStub({children: [{}]});

    expect(new Manager(state).children[0].parent?.getItem()).toEqual(state);
  })

  test('.next', () => {
    expect(itemMng.children[0].next).toEqual(itemMng.children[1]);
    expect(itemMng.children[1].next).toBeNull();
  });

  test('.prev', () => {
    expect(itemMng.children[0].prev).toBeNull();
    expect(itemMng.children[1].prev).toEqual(itemMng.children[0]);
  });

  test('.getTarget()', () => {
    expect(itemMng.gegTarget()).toBeNull();
    itemMng.children[1].isTarget = true;
    expect(itemMng.gegTarget()).toEqual(itemMng.children[1]);
  })

  describe('.setTarget()', () => {
    test('set', () => {
      itemMng.setTarget(itemMng.children[1]);
      expect(itemMng.children[1].isTarget).toBeTruthy()
      expect(itemMng.flatten().filter(item => item.isTarget).length).toEqual(1);
    })
    test('unset', () => {
      itemMng.setTarget(null);
      expect(itemMng.flatten().filter(item => item.isTarget))
        .toHaveLength(0)
    })
  })

  test('.create()', () => {
    const parent = makeItemStub();
    const itemMng = new Manager(parent);
    const assertCreate = (name: string, position = Infinity) => expect(
      itemMng.create({name}, position).name
    )
      .toEqual(name);

    (['0', '1', '2']).forEach(
      (value, index) => assertCreate(`${index}`)
    )

    assertCreate('-1', -1);
    assertCreate('1.1', 1);
    assertCreate('10', 10);

    expect(
      parent
        .children
        .map(item => item.name)
    )
      .toStrictEqual([
        '-1',
        '1.1',
        '0',
        '1',
        '2',
        '10',
      ]);
  })

  test('.clone()', () => {
    const item = makeItemStub(rootTemplate);
    const unsetUid = (item: Item): Item => ({
      ...item,
      uid: null,
      children: item.children
        .map(subItem => unsetUid(subItem)),
    });

    expect(item.uid).not.toBeNull();

    expect(
      unsetUid(item)
    )
      .toEqual(
        (new ItemManager(item))
          .clone()
          .getItem()
      );
  })

  test('.update() all', () => {
    const name = '+';

    expect(
      itemMng.update({name})
    )
      .toEqual(itemMng.flatten())
    expect(
      itemMng
        .flatten()
        .map(item => item.name)
    ).toEqual(
      new Array(itemMng.flatten().length)
        .fill(name)
    )
  });

  test('.update() filtered', () => {
    const name = '+';
    const target = itemMng.getItem();

    expect(
      itemMng
        .update({name}, {uid: target.uid})
        .map(item => item.getItem())
    )
      .toEqual([Object.assign({}, target, {name})])
    expect(target.name).toEqual(name);
  });

  test('.forEach() all', () => {
    expect(
      new Manager(makeItemStub(Object.assign(
        {},
        rootTemplate,
        {
          name: 'a',
        },
      )))
        .forEach(item => item.name = item.name.toUpperCase())
        .map(item => item.name)
    )
      .toStrictEqual([
        'A',
        'A.0',
        'A.0.0',
        'A.0.0.0',
        'A.1',
        'A.1.0',
        'A.1.0.0',
      ])
  });

  test('.forEach() filtered', () => {
    expect(
      new Manager(makeItemStub(Object.assign(
        {},
        rootTemplate,
        {
          name: 'a',
        },
      )))
        .forEach(
          item => item.name = item.name.toUpperCase(),
          {
            name: 'a.0.0.0',
          },
        )
        .map(item => item.name)
    )
      .toStrictEqual([
        'A.0.0.0',
      ])
  });

  test('.remove() all', () => {
    const targets = itemMng
      .children;

    expect(
      itemMng
        .remove()
        .map(item => item.name)
    )
      .toEqual(targets.map(item => item.name))
    expect(itemMng.children)
      .toHaveLength(0)
  });

  test('.remove() filtered', () => {
    const target = itemMng.children[1].children[0].children[0]

    expect(
      itemMng
        .remove({
          name: target.name
        })
        .map(item => item.name)
    )
      .toEqual([target.name])
    expect(itemMng.children[1].children[0].children)
      .toHaveLength(0)
    expect(itemMng.has(target)).toBeFalsy()
  });

  test('.flatten()', () => {
    expect(
      itemMng
        .flatten()
        .map(item => item.name)
    )
      .toStrictEqual([
        '0',
        '0.0',
        '0.0.0',
        '0.0.0.0',
        '0.1',
        '0.1.0',
        '0.1.0.0',
      ]);
  })

  test('.find()', () => {
    const target = itemMng.getItem();
    expect(itemMng.find(target)?.uid).toEqual(target.uid)
  });

  test('.has()', () => {
    const target = itemMng.getItem()
    expect(itemMng.has(target)).toBeTruthy();
  });

  test('.filter()', () => {
    const target = itemMng.getItem();
    expect(
      itemMng
        .filter({name: target.name})
        .map(item => item.getItem())
    )
      .toEqual([target])
  });
});
