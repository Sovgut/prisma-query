## Example

```typescript
import { PrismaClient } from '@prisma/client';
import { createQuery, property, Query, QueryOptions } from '@sovgut/prisma-query';

const insensetiveSearch = (value: string, key: string) => ({ [key]: { contains: value, mode: 'insensetive' } });
const greaterOrEqualThan = (value: number, key: string) => ({ [key]: { gte: value } });
const matchOutlookEmail = (value: string) => /([@]){1}([a-zA-Z]){1,}([\.]){1}([a-zA-Z]){1,}/.test(value);

const scheme: QueryOptions = [
  property('firstName').optional().onInject(insensetiveSearch),
  property('age').parse('number').onInject(greaterOrEqualThan),
  property('email').onValidate(matchOutlookEmail).onInject(insensetiveSearch),
  property('username').parse((value: string) => {
    const [_, username] = value.split(' // ');
    return username || value;
  })
];

const query: Query = {
  firstName: 'Ser',
  age: '28',
  email: '@outlook.com',
  username: 'DEVUA // Sovgut'
};

const whereQuery = createQuery(query, scheme)
// {
//   firstName: { contains: 'Ser', mode: 'insensetive' },
//   age: { gte: 28 },
//   email: { contains: '@outlook.com', mode: 'insensetive' }
//   username: 'Sovgut'
// }

// Then you can use this `whereQuery` in prisma query for searching in database
new PrismaClient().users.findMany({ where: whereQuery }).then((users) => ...);
// [
//   {
//     firstName: 'Sergey',
//     age: 28,
//     email: 'dev.devua@outlook.com'
//     ... other fields
//   },
//   ... more founded users
// ]
```

## API

<hr />

### `property(key: "name"): Property`

_Params_

- `key` - the name of property for target source

_Returns_

- `parse((type: 'number' | 'boolean' | 'date' | 'date-string') | (value: any) => any)` - parse the value from source to selected type or using custom hoot for parsing values
- `onInject((value: any, key?: string, container?: any) => any) | string)` - the result of executing this function extends the result of container generation
- `onValidate((value: any) => boolean)` - sets additional custom validation for source property, throws an exception if result from this hook is `false`
- `optional()` - sets source property as optional and any validations just skipped this property if error raised

<hr />

### `createQuery(query: Query, scheme: QueryOptions): any`

_Params_

- `query` - the source object that should be processed
- `scheme` - this array explains what need to do with `query` object

_Returns_

- `container` - the object thats friendly for `{ where: statement }` in prisma query with parsed data, mutated objects, swapped property name and had additional validations

_Exception throws_

- if `query` is undefined
- if `scheme` is invalid or undefined
- if property is undefined when `optional` is not provided
- if property value is undefined when `optional` is not provided
- if `onValidate` returns `false`
