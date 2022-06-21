import { ListNode, Query, QueryOptions } from '../../types';
import parseValue from './utils/parseValue';
import validateQuery from './utils/validateQuery';
import validateScheme from './utils/validateScheme';
import validateValue from './utils/validateValue';

const createQuery = (query: Query, scheme: QueryOptions): any => {
  let container: any = {};

  const validatedQuery = validateQuery(query);
  if (!validatedQuery) {
    throw new Error('prisma-query.invalid-query');
  }

  const validatedScheme = validateScheme(scheme);
  if (!validatedScheme) {
    throw new Error('prisma-query.invalid-scheme');
  }

  const listContainer = new Map<string, ListNode[]>();
  for (const options of validatedScheme) {
    const extractedOptions = options.extract();
    const node: ListNode = {
      current: extractedOptions,
    };

    if (listContainer.has(extractedOptions.key)) {
      const list = listContainer.get(extractedOptions.key) as ListNode[];
      const prevNode = list[list.length - 1];

      prevNode.next = node;
      node.prev = prevNode;

      list.push(node);
      listContainer.set(extractedOptions.key, list);
    } else {
      listContainer.set(extractedOptions.key, [node]);
    }
  }

  for (const key of listContainer.keys()) {
    for (const node of listContainer.get(key) as ListNode[]) {
      const options = node.current;
      const value = validatedQuery[options.key];
      const isValid = validateValue(value);

      if (options.optional) {
        if (!isValid) {
          continue;
        }
      } else {
        if (!isValid) {
          throw new Error(`${options.key}.value-is-empty`);
        }
      }

      if (options.onValidate && !options.onValidate(value)) {
        if (node.next || options.optional) {
          continue;
        } else {
          throw new Error(`${options.key}.failed-on-validate`);
        }
      }

      let parsedValue: any = value;
      if (options.parse) {
        if (typeof options.parse === 'string') {
          parsedValue = parseValue(value, options.parse);
        } else {
          parsedValue = options.parse(value);
        }
      }

      if (typeof options.onInject !== 'function') {
        container[options.onInject || options.key] = parsedValue;
      } else {
        container = {
          ...container,
          ...options.onInject(parsedValue, options.key, container),
        };
      }

      break;
    }
  }

  return container;
};

export default createQuery;
