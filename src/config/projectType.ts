export const projectType = [
  {
    value: '100000',
    label: '地质调查',
    children: [
      {
        value: '100100',
        label: '地质调查',
      },
      {
        value: '100200',
        label: '物探',
      },
      {
        value: '100300',
        label: '分析测试',
      },
      {
        value: '100400',
        label: '科研项目',
      },
    ],
  },
  {
    value: '200000',
    label: '矿产勘查',
    children: [
      {
        value: '200100',
        label: '矿产勘查',
      },
      {
        value: '200200',
        label: '矿山技术服务',
      },
      {
        value: '200300',
        label: '矿产规划',
      },
      {
        value: '200400',
        label: '科研项目',
      },
    ],
  },
  {
    value: '300000',
    label: '自然资源调查与空间规划',
    children: [
      {
        value: '300100',
        label: '自然资源调查监测',
      },
      {
        value: '300200',
        label: '国土利用与评价类',
      },
      {
        value: '300300',
        label: '国土空间规划',
      },
      {
        value: '300400',
        label: '科研项目',
      },
    ],
  },
  {
    value: '400000',
    label: '国土整治与生态修复',
    children: [
      {
        value: '400100',
        label: '国土整治',
      },
      {
        value: '400200',
        label: '生态保护修复（含生态环境类）',
      },
      {
        value: '400300',
        label: '土壤三普类',
      },
      {
        value: '400400',
        label: '科研项目',
      },
    ],
  },
  {
    value: '500000',
    label: '地质环境与地质工程',
    children: [
      {
        value: '500100',
        label: '地灾调查、评估',
      },
      {
        value: '500200',
        label: '地灾勘查、设计',
      },
      {
        value: '500300',
        label: '地灾监理',
      },
      {
        value: '500400',
        label: '地灾监测',
      },
      {
        value: '500500',
        label: '地灾施工',
      },
      {
        value: '500600',
        label: '水文地质',
      },
      {
        value: '500700',
        label: '工程地质',
      },
      {
        value: '500800',
        label: '城市地质',
      },
      {
        value: '500900',
        label: '科研项目',
      },
    ],
  },
  {
    value: '600000',
    label: '测绘地理信息',
    children: [
      {
        value: '600100',
        label: '基础测绘',
      },
      {
        value: '600200',
        label: '界线与不动产测绘',
      },
      {
        value: '600300',
        label: '航空摄影与遥感',
      },
      {
        value: '600400',
        label: '地理信息系统工程',
      },
      {
        value: '600500',
        label: '其他测绘',
      },
      {
        value: '600600',
        label: '科研项目',
      },
    ],
  },
  {
    value: '700000',
    label: '其他',
    children: [
      {
        value: '700100',
        label: '建设工程施工',
      },
      {
        value: '700200',
        label: '其他',
      },
    ],
  },
];

export const getProjectTypeStr = (codeStr: string) => {
  const codes = codeStr.split(',');
  const type_1 = projectType.find((p) => p.value === codes[0]);
  if (!type_1) return codeStr;
  const type_2 = type_1.children?.find((c) => c.value === codes[1]);
  if (!type_2) return type_1.label;
  return `${type_1.label}-${type_2.label}`;
};
