export const getRandomIndex = <T>(arr: T[]): number =>
  Math.floor(Math.random() * arr.length);

export function randomChoice<T>(arr: T[]): T;
export function randomChoice<T, K extends keyof T>(
  arr: T[],
  property?: K,
): T[K];

export function randomChoice<T, K extends keyof T>(
  arr: T[],
  property?: K,
): T[K] | T {
  const randomIndex = getRandomIndex(arr);

  return property ? arr[randomIndex][property] : arr[randomIndex];
}

export const randomInt = (min: number, max: number): number => {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);

  return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
};

export const getRandomIndices = <T>(arr: T[]): number[] => {
  const length = arr.length;
  const numIndicesToSelect = Math.floor(Math.random() * (length + 1)); // 随机选择 [0, N] 个元素

  // 生成数组的索引范围 [0, 1, ..., length-1]
  const allIndices = Array.from({ length }, (_, index) => index);

  // Fisher-Yates shuffle 算法，打乱数组顺序
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }

  // 选择前 numIndicesToSelect 个元素的索引
  const selectedIndices = allIndices.slice(0, numIndicesToSelect);

  return selectedIndices;
};
