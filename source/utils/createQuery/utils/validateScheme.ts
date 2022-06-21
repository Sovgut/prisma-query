import { Property } from '../../../types';

const validateScheme = (scheme: unknown): Property[] | null => {
  if (typeof scheme !== 'object' || !Array.isArray(scheme) || scheme.length === 0) {
    return null;
  }

  for (const item of scheme as Property[]) {
    const extractedScheme = item.extract();
    if (!extractedScheme.key || typeof extractedScheme.key !== 'string') {
      return null;
    }
  }

  return scheme as Property[];
};

export default validateScheme;
