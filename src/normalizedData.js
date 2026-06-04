const normalizedData = function (data, parent = null) {
  let result = {};
  if (data.length) {
    data.forEach((element) => {
      const child = element.children;
      result[element.id] = {
        ...element,
        parent: parent,
        checked: false,
        childIds: child ? child.map((c) => c.id) : [],
      };
      if (child && child.length) {
        result = { ...result, ...normalizedData(child, element.id) };
      }
    });
  }
  return result;
};

export default normalizedData;
