export const CONSTANTS = {
  production: [
    {
      id: 'GHZX001',
      name1: '调查所',
      name2: '调查事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX002',
      name1: '航测遥感所',
      name2: '航测遥感事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX003',
      name1: '国土空间规划所',
      name2: '国土空间规划事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX004',
      name1: '勘测设计所',
      name2: '勘测设计事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX005',
      name1: '测绘地理信息所',
      name2: '测绘地理信息事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX006',
      name1: '监测评价所',
      name2: '监测评价事业部',
      type: '生产部门',
    },
    {
      id: 'GHZX007',
      name1: '地质勘察所',
      name2: '地质勘察事业部',
      type: '生产部门',
    },
  ],
  management: [
    {
      id: 'GHZX101',
      name1: '办公室',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX102',
      name1: '财务资产管理科',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX103',
      name1: '人事科',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX104',
      name1: '科技信息科',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX105',
      name1: '市场发展科',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX106',
      name1: '生产经营管理科',
      name2: '',
      type: '管理部门',
    },
    {
      id: 'GHZX107',
      name1: '安全监督管理科',
      name2: '',
      type: '管理部门',
    },
  ],
  personnel: [
    {
      id: 'GHZX201',
      name1: '分管领导',
      name2: '',
      type: '管理人员',
    },
    {
      id: 'admin',
      name1: '超级管理员',
      name2: '',
      type: '管理人员',
    },
  ],
};

export const DepartmentCodeToName = Object.fromEntries(
  [...CONSTANTS.production, ...CONSTANTS.management].map((department) => [
    department.id,
    department.name1,
  ]),
);
