export interface ValidationRules {
  // [key: string]: (value: any) => boolean | string;
  [key: string]: any;
}

export interface ValidationRule {
  [key: string]: Function | string;
}

export function parseValidationRules(jsonRules: ValidationRules) {
  const extractFunctionParts = (fnString: string) => {
    // Match everything between parentheses for parameters
    // and everything between => and the end of string for the body
    const functionRegex = /^\s*\((.*?)\)\s*=>\s*({[\s\S]*}|\S.*?$)/;
    const match = fnString.trim().match(functionRegex);

    if (!match) return null;

    const [, params, body] = match;

    // If the body is a single expression (no curly braces), wrap it with return
    const processedBody = body.trim().startsWith('{')
      ? body.trim()
      : `{ return ${body.trim()}; }`;

    return { params, body: processedBody };
  };

  const createFunctionFromString = (fnString: string) => {
    const parts = extractFunctionParts(fnString);
    if (!parts) return null;

    try {
      // Create function using Function constructor
      return new Function(parts.params, parts.body);
    } catch (error) {
      console.error('Failed to parse function:', error);
      return null;
    }
  };

  return jsonRules.map((rule: ValidationRule) => {
    const newRule = { ...rule };

    // Process each property that's not errorMessage and contains a function string
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