export const calculate16PFResult = (values: SPFValue[]): SPFResult => {
  const initValues = values.reduce(
    (o, cv) => {
      if (cv.factor) {
        if (o[cv.factor] === undefined) {
          o[cv.factor] = cv.point;
        } else {
          o[cv.factor] += cv.point;
        }
      }

      return o;
    },
    {} as { [K in SPFFactor]: number },
  );

  return initValues;

  // return Object.keys(initValues).map((k: SPFFactor) => ({
  //   factor: k,
  //   total: initValues[k],
  //   label: ''
  // }))
};
