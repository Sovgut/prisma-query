import SearchException from '../../exceptions/searchException';
import { ListNode, Query, QueryScheme } from '../../types';
import parseValue from './utils/parseValue';
import validateQuery from './utils/validateQuery';
import validateScheme from './utils/validateScheme';
import validateValue from './utils/validateValue';

const createQuery = (query: Query, scheme: QueryScheme[]): any => {
  let container: any = {};

  const validatedQuery = validateQuery(query);
  if (!validatedQuery) return container;

  const validatedScheme = validateScheme(scheme);
  if (!validatedScheme) {
    throw new SearchException('prisma-query', 'invalid-scheme');
  }

  const listContainer = new Map<string, ListNode[]>();
  for (const options of validatedScheme) {
    const node: ListNode = {
      current: options,
    };

    if (listContainer.has(options.key)) {
      const list = listContainer.get(options.key) as ListNode[];
      const prevNode = list[list.length - 1];

      prevNode.next = node;
      node.prev = prevNode;

      list.push(node);
      listContainer.set(options.key, list);
    } else {
      listContainer.set(options.key, [node]);
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
          throw new SearchException(options.key, 'value-is-empty');
        }
      }

      if (options.onValidate && !options.onValidate(value)) {
        if (node.next || options.optional) {
          continue;
        } else {
          throw new SearchException(options.key, 'failed-on-search');
        }
      }

      let parsedValue: any = value;
      if (options.parse) {
        parsedValue = parseValue(value, options.parse);
      }

      if (typeof options.containerKey !== 'function') {
        container[options.containerKey || options.key] = parsedValue;
      } else {
        container = {
          ...container,
          ...options.containerKey(parsedValue, options.key, container),
        };
      }

      break;
    }
  }

  return container;
};

export default createQuery;
