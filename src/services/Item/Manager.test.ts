import { makeItemStub } from "../../stubs/item.stub";
import Manager from "./Manager";

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
    expect(itemMng.find(target))
      .toEqual(null)
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

    expect(
      itemMng.find(target)?.uid
    )
      .toEqual(target.uid)
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
