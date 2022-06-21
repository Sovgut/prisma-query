import { Query } from '../../../types';

const validateQuery = (query: unknown): Query | null => {
  if (typeof query === 'object' && Object.keys(query as object).length > 0) {
    return query as Query;
  }

  return null;
};

export default validateQuery;
