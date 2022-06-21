import { ConvertTypes, ParseValueResult, Value } from '../../../types';

const parseValue = (value: Value, type: ConvertTypes): ParseValueResult => {
  switch (type) {
    case 'boolean':
      return Boolean(value) === true;
    case 'number':
      return parseFloat(value as string);
    case 'date':
      return new Date(parseInt(value as string, 10));
    case 'date-string':
      return new Date(value as string);
    default:
      return value as string;
  }
};

export default parseValue;
