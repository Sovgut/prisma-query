import { Query } from '../../../types';

const validateQuery = (query: unknown): Query | null => {
  if (typeof query === 'object') {
    return query as Query;
  }

  return null;
};

export default validateQuery;
