import { ConvertTypes, Property, QueryScheme } from '../types';

const property = (key: string): Property => {
  const closure: QueryScheme = { key };

  return {
    onValidate(callback: (value: unknown) => boolean) {
      closure.onValidate = callback;

      return this;
    },
    parse(type: ConvertTypes) {
      closure.parse = type;

      return this;
    },
    optional() {
      closure.optional = true;

      return this;
    },
    onInject(callback: ((value: unknown, key?: string, container?: any) => any) | string) {
      closure.onInject = callback;

      return this;
    },
    extract: (): QueryScheme => closure,
  };
};

export default property;
