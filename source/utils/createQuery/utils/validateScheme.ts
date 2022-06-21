import { QueryScheme } from '../../../types';

const validateScheme = (scheme: unknown): QueryScheme[] | null => {
  if (typeof scheme !== 'object' || !Array.isArray(scheme) || scheme.length === 0) {
    return null;
  }

  for (const item of scheme as QueryScheme[]) {
    if (!item.key || typeof item.key !== 'string') {
      return null;
    }
  }

  return scheme as QueryScheme[];
};

export default validateScheme;
