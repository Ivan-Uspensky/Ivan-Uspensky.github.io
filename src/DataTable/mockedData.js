import { faker } from '@faker-js/faker';

const generateColors = () => {
  const colors = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' }
  ];
  return colors;
}

const generateData = (rows, subRows) => {
  const colors = generateColors().map(color => color.value);
  
  const data = {
    columns: [
      { id: 'name', ordinalNo: 1, title: 'Name', type: 'string', width: 100 },
      { id: 'weight', ordinalNo: 2, title: 'Weight', type: 'number', width: 100 },
      { id: 'isAvailable', ordinalNo: 3, title: 'Availability', type: 'boolean', width: 100 },
      { id: 'color', ordinalNo: 4, title: 'Color', type: 'select', width: 150 },
    ],
    data: []
  };

  for (let i = 1; i <= rows; i++) {
    const row = {
      id: faker.string.nanoid(10),
      name: faker.vehicle.bicycle(),
      weight: faker.number.int({ min: 5, max: 45 }),
      isAvailable: faker.datatype.boolean(),
      color: faker.helpers.arrayElement(colors),
      subRows: []
    };

    for (let j = 1; j <= subRows; j++) {
      const subRowId = `${i}.${j}`;
      const subRow = {
        id: subRowId,
        name: faker.vehicle.model(),
        weight: faker.number.int({ min: 5, max: 45 }),
        isAvailable: faker.datatype.boolean(),
        color: faker.helpers.arrayElement(colors),
      };
      row.subRows.push(subRow);
    }

    data.data.push(row);
  }

  return data;
}

export { generateColors, generateData }; 