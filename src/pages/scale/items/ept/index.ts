type Position = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export const types: { type: EptTypes; label: string; position: Position }[] = [
  {
    type: "REFORMER",
    label: "完美主义者",
    position: { top: "1rem", left: "calc(50% - 2.5rem)" },
  },
  {
    type: "HELPER",
    label: "全爱自助型",
    position: { top: "3rem", right: "2rem" },
  },
  {
    type: "ACHIEVER",
    label: "成就型",
    position: { top: "7.5rem", right: "1rem" },
  },
  {
    type: "INDIVIDUALIST",
    label: "自我型",
    position: { bottom: "5rem", right: "2rem" },
  },
  {
    type: "INVESTIGATOR",
    label: "智慧型",
    position: { bottom: "1.5rem", right: "6.5rem" },
  },
  {
    type: "LOYALIST",
    label: "忠诚型",
    position: { bottom: "1.5rem", left: "7rem" },
  },
  {
    type: "ENTHUSIAST",
    label: "活跃型",
    position: { bottom: "5rem", left: "2.5rem" },
  },
  {
    type: "CHALLENGER",
    label: "领袖型",
    position: { top: "7.5rem", left: "1rem" },
  },
  {
    type: "PEACEMAKER",
    label: "和平型",
    position: { top: "3rem", left: "4rem" },
  },
];

type EptValues = Record<EptTypes, { total: EptResultItem["total"] }>;

export const calculateEptResult = (values: EptValue[]): EptResult => {
  const initValues: EptValues = types.reduce((obj, v) => {
    obj[v.type] = { total: { yes: 0, no: 0 } };

    return obj;
  }, {} as EptValues);

  values.forEach(({ type, point }) => {
    if (point === 1) {
      initValues[type].total.yes += 1;
    } else {
      initValues[type].total.no += 1;
    }
  });

  const result = types.map(({ type, label }) => ({
    type,
    label,
    total: initValues[type].total,
  }));

  return result;
};
