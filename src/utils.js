export const createNot = (fn) => (...args) => !fn(...args);

export const createRegexpHandler = (caseItem) => (value) => caseItem.test(value);

export const createStandardHandler = (caseItem) => (value) => caseItem === value;

export const noop = () => {};

export const reduce = (array, fn, initialValue) => {
  let value = initialValue;

  for (let index = 0; index < array.length; index++) {
    value = fn(value, array[index]);
  }

  return value;
};

export const setType = (object, value) => {
  Object.defineProperty(object, 'type', {value});

  return object;
};

export const getCasesAndDefault = (handlers) =>
  reduce(
    handlers,
    (split, handler) => {
      if (handler.type === 'defaultsTo') {
        split.defaultsTo = handler;
      } else if (handler.type) {
        split.cases.push(handler);
      }

      return split;
    },
    {
      cases: [],
      defaultsTo: noop
    }
  );

export const getMatchHandler = (caseItem, isNot) =>
  typeof caseItem === 'function'
    ? isNot
      ? createNot(caseItem)
      : caseItem
    : caseItem && caseItem instanceof RegExp
      ? isNot
        ? createNot(createRegexpHandler(caseItem))
        : createRegexpHandler(caseItem)
      : isNot
        ? createNot(createStandardHandler(caseItem))
        : createStandardHandler(caseItem);

export const createCase = (type) => (caseItem) => {
  const matchHandler = getMatchHandler(caseItem, type.indexOf('not') === 0);

  return type === 'defaultsTo'
    ? setType(typeof caseItem === 'function' ? (value) => caseItem(value) : () => caseItem, type)
    : {
      then: (handler) =>
        setType(
          (value) => ({
            isMatch: matchHandler(value),
            onMatch: typeof handler === 'function' ? () => handler(value) : () => handler
          }),
          type
        )
    };
};

export const createMatch = (isAll) => (...args) => {
  const {cases, defaultsTo} = getCasesAndDefault(args);

  return isAll
    ? (value) => {
      let result;

      const results = reduce(
        cases,
        (matchResults, caseItem) => {
          result = caseItem(value);

          if (result.isMatch) {
            matchResults.push(result.onMatch());
          }

          return matchResults;
        },
        []
      );

      return results.length ? results : [defaultsTo(value)];
    }
    : (value) => {
      let result;

      for (let index = 0; index < cases.length; index++) {
        result = cases[index](value);

        if (result.isMatch) {
          return result.onMatch();
        }
      }

      return defaultsTo(value);
    };
};
