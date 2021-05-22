import faker from "faker";
import Status, { DONE_STATUS, IN_PROGRESS_STATUS, OPEN_STATUS } from "../../types/Item/Status";
import Priority, { HIGH_PRIORITY, LOW_PRIORITY, MIDDLE_PRIORITY } from "../../types/Item/Priority";
import Item from "../../types/Item/Item";
import NoneState from "../../types/Item/States/NoneState";

export const makeItem = (): Item => ({
  name: faker.lorem.word(),
  description: faker.lorem.text(),
  order: faker.datatype.number(5),
  isOpen: faker.datatype.boolean(),
  isSelected: faker.datatype.boolean(),
  status: faker.random.arrayElements([OPEN_STATUS, IN_PROGRESS_STATUS, DONE_STATUS]) as any as Status,
  priority: faker.random.arrayElements([LOW_PRIORITY, MIDDLE_PRIORITY, HIGH_PRIORITY]) as any as Priority,
  parent: null,
  children: [],
  state: new NoneState(),
})
