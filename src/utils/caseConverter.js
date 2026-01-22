// src/utils/caseConverter.js
export const pascalToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(pascalToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      // Convert PascalCase to camelCase
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      acc[camelKey] = pascalToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};