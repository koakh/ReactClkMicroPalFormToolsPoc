export interface ValidationRules {
  [key: string]: any;
}

export interface ValidationRule {
  [key: string]: Function | string;
}

/**
 * extract function params and body parts from string function
 * @param fnString 
 * @returns returns param and body
 */
const extractFunctionParts = (fnString: string) => {
  // match everything between parentheses for parameters
  // and everything between => and the end of string for the body
  const functionRegex = /^\s*\((.*?)\)\s*=>\s*({[\s\S]*}|\S.*?$)/;
  const match = fnString.trim().match(functionRegex);

  if (!match) return null;

  const [, params, body] = match;

  // if the body is a single expression (no curly braces), wrap it with return
  const processedBody = body.trim().startsWith('{')
    ? body.trim()
    : `{ return ${body.trim()}; }`;

  return { params, body: processedBody };
};

/**
 * create js function from functionString
 * @param fnString 
 * @returns null or anonymous function
 */
export const createFunctionFromString = (fnString: string): Function | null => {
  const parts = extractFunctionParts(fnString);
  if (!parts) return null;

  try {
    // create function using function constructor
    // eslint-disable-next-line
    return new Function(parts.params, parts.body);
  } catch (error) {
    console.error('failed to parse function:', error);
    return null;
  }
};

/**
 * parse validation rules in format `[{"key": "(value) => return false}, errorMessage: 'message'"}, {}, ...]`
 * @param jsonRules 
 * @returns ValidationRules object
 */
export const parseValidationRules = (jsonRules: ValidationRules): ValidationRules => {
  return jsonRules.map((rule: ValidationRule) => {
    const newRule = { ...rule };

    // process each property that's not errorMessage and contains a function string
    Object.keys(rule).forEach(key => {
      if (key === 'errorMessage') return;

      const value = rule[key];
      if (typeof value === 'string' && value.includes('=>')) {
        const fn = createFunctionFromString(value);
        if (fn) {
          newRule[key] = fn;
        }
      }
    });

    return newRule;
  });
}