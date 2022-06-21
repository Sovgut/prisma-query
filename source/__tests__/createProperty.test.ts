import property from '../utils/createProperty';

it('Should create property instance', () => {
  expect(JSON.stringify(property('test'))).toEqual(
    JSON.stringify({
      optional: () => {},
      parse: () => {},
      onValidate: () => {},
      onInject: () => {},
      extract: () => {},
    }),
  );
});

it('Should extract key property', () => {
  expect(property('score').extract()).toEqual({ key: 'score' });
});

it('Should extract optional property', () => {
  expect(property('score').optional().extract()).toEqual({ key: 'score', optional: true });
});

it('Should extract parse property', () => {
  expect(property('score').optional().parse('number').extract()).toEqual({
    key: 'score',
    optional: true,
    parse: 'number',
  });
});

it('Should extract onValidate property', () => {
  expect(
    JSON.stringify(
      property('score')
        .optional()
        .parse('number')
        .onValidate(function onValidate(value: number) {
          return value > 0;
        })
        .extract(),
    ),
  ).toEqual(
    JSON.stringify({
      key: 'score',
      optional: true,
      parse: 'number',
      onValidate(value: number) {
        return value > 0;
      },
    }),
  );
});

it('Should extract onInject property', () => {
  expect(
    JSON.stringify(
      property('score')
        .optional()
        .parse('number')
        .onValidate(function onValidate(value: number) {
          return value > 0;
        })
        .onInject(function onInject(value: number) {
          return { gte: value };
        })
        .extract(),
    ),
  ).toEqual(
    JSON.stringify({
      key: 'score',
      optional: true,
      parse: 'number',
      onValidate(value: number) {
        return value > 0;
      },
      onInject(value: number) {
        return { gte: value };
      },
    }),
  );
});
