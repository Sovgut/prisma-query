import type { Query, QueryOptions } from '../types';
import property from '../utils/createProperty';
import createQuery from '../utils/createQuery';
import parseValue from '../utils/createQuery/utils/parseValue';
import validateQuery from '../utils/createQuery/utils/validateQuery';
import validateScheme from '../utils/createQuery/utils/validateScheme';
import validateValue from '../utils/createQuery/utils/validateValue';

const insensitiveSearch = (value: unknown, key?: string) => ({
  [key as string]: { contains: value, mode: 'insensitive' },
});

const MOCK_SCHEME: QueryOptions = [
  property('firstName')
    .optional()
    .onValidate(() => true)
    .onInject(insensitiveSearch),
  property('age').optional().parse('number'),
  property('username').parse((value: string) => {
    const [_, username] = value.split(' // ');
    return username || value;
  }),
];
const MOCK_QUERY: Query = { firstName: 'Sergey', username: 'DEVUA // Sovgut' };
const MOCK_CREATED_QUERY = { firstName: { contains: 'Sergey', mode: 'insensitive' }, username: 'Sovgut' };

test('Should return scheme for valid scheme', () => {
  expect(validateScheme(MOCK_SCHEME)).toEqual(MOCK_SCHEME);
});

test('Should return null for invalid scheme', () => {
  expect(validateScheme({})).toEqual(null);
});

test('Should return query for valid query', () => {
  expect(validateQuery(MOCK_QUERY)).toEqual(MOCK_QUERY);
});

test('Should return null for invalid query', () => {
  expect(validateQuery(undefined)).toEqual(null);
});

test('Should return false for invalid value', () => {
  expect(validateValue(undefined)).toEqual(false);
});

test('Should convert value to received types', () => {
  const dateNumber = Date.now();
  const dateString = new Date(dateNumber).toISOString();
  const asBoolean = parseValue('true', 'boolean');
  const asNumber = parseValue('123', 'number');
  const asDateNumber = parseValue(dateNumber, 'date');
  const asDateString = parseValue(dateString, 'date-string');

  expect(asBoolean).toEqual(true);
  expect(asNumber).toEqual(123);
  expect(asDateNumber).toEqual(new Date(dateNumber));
  expect(asDateString).toEqual(new Date(dateNumber));
});

test('Should create query container', () => {
  expect(createQuery(MOCK_QUERY, MOCK_SCHEME)).toEqual(MOCK_CREATED_QUERY);
});

test('Should throw exception on undefined query', () => {
  const ANY_QUERY: any = undefined;
  expect(() => createQuery(ANY_QUERY, MOCK_SCHEME)).toThrow('prisma-query.invalid-query');
});

test('Should throw exception on empty scheme', () => {
  expect(() => createQuery(MOCK_QUERY, [])).toThrow('prisma-query.invalid-scheme');
});

test('Should throw exception on invalid query with valid scheme', () => {
  MOCK_SCHEME.push(property('age').parse('number'));
  expect(() => createQuery(MOCK_QUERY, MOCK_SCHEME)).toThrow('age.value-is-empty');
});
