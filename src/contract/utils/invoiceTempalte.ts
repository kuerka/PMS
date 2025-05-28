import { ContractInvoiceRecord } from '../entities/invoice-record.entity';
import * as exceljs from 'exceljs';
import * as dayjs from 'dayjs';
import { getProjectTypeStr } from '@/config/projectType';
import { DepartmentMap } from '@/config/department';
import { getLocationStr, municipality } from '@/config/location';
import { CellRichTextValue } from 'exceljs';

const NumberToChinese = (numStr: string) => {
  try {
    const num = parseInt(numStr);
    const numArray = [
      '零',
      '壹',
      '贰',
      '叁',
      '肆',
      '伍',
      '陆',
      '柒',
      '捌',
      '玖',
    ];
    if (typeof num === 'number' && num >= 0 && num <= 9) {
      return numArray[num];
    }
    return '';
  } catch (e) {
    console.log(e);
    return '';
  }
};

const getDepartmentFromNumber = (numStr: string) => {
  const pattern = /([A-Z]{2})(\d{4}\d{3})$/;
  const lastSeven = numStr.slice(-9);
  const match = pattern.exec(lastSeven);
  if (!match) return '';
  const departmentCode = match[1].toUpperCase();
  return DepartmentMap[departmentCode] ?? '';
};

const filterMunicipality = (locations: string[]) => {
  const province = locations[0];
  if (!municipality.some((item) => item.name === province)) return locations;
  if (locations.length >= 2) locations.splice(1, 1);
  return ['', ...locations];
};

const removeProvinceCityCounty = (str: string) => {
  return str.replace(/(省|市|县|区)$/, '');
};

export const downloadInvoiceTemplate = (
  query: ContractInvoiceRecord,
  templateType: string,
) => {
  if (templateType === 'CHY')
    return handleCHYTemplate(query, `./assests/invoice_template/CHY.xlsx`);
  else if (templateType === 'GHZX')
    return handleCHYTemplate(query, './assests/invoice_template/GHZX.xlsx');
};

export const handleCHYTemplate = async (
  query: ContractInvoiceRecord,
  path: string,
) => {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(path);
  const worksheet = workbook.getWorksheet(1)!;

  const invoiceType = query.invoiceType;
  const companyName = query.contract.invoiceHeader.companyName;
  const contractNumber = query.contract.contractNumber;
  const leadingDepartment = getDepartmentFromNumber(contractNumber);
  const projectType = getProjectTypeStr(query.contract.projectType ?? '');
  const invoiceAmount = query.invoiceAmount;
  const contractAmount = query.contract.contractAmount;
  const projectName = query.contract.projectName;
  const contactPhone = query.contract.invoiceHeader.contactPhone;
  const taxpayerIdentificationNumber =
    query.contract.invoiceHeader.taxpayerIdentificationNumber;
  const bankAccount = query.contract.invoiceHeader.bankAccount;
  const address = query.contract.invoiceHeader.address;
  const bankName = query.contract.invoiceHeader.bankName;
  const applicationDate = dayjs(query.invoiceTime);
  let locations = getLocationStr(query.contract.projectLocation!).split('-');
  locations = filterMunicipality(locations).map(removeProvinceCityCounty);

  worksheet.getCell('AO4').value = applicationDate.get('year').toString();
  worksheet.getCell('AR4').value = (
    applicationDate.get('months') + 1
  ).toString();
  worksheet.getCell('AT4').value = applicationDate.get('date').toString();

  worksheet.getCell('N7').value = projectName;
  worksheet.getCell('AO7').value = contractNumber;
  worksheet.getCell('N8').value = leadingDepartment;
  worksheet.getCell('AO8').value = projectType;
  if (locations[0]) worksheet.getCell('N9').value = locations[0];
  if (locations[1]) worksheet.getCell('U9').value = locations[1];
  if (locations[2]) worksheet.getCell('AB9').value = locations[2];

  worksheet.getCell('AO9').value = `${contractAmount}元`;
  worksheet.getCell('N10').value = companyName;
  worksheet.getCell('AO10').value = taxpayerIdentificationNumber;
  worksheet.getCell('N11').value = bankName;
  worksheet.getCell('AO11').value = bankAccount;
  worksheet.getCell('N12').value = address;
  worksheet.getCell('AO12').value = contactPhone;

  const floatStr = [...parseFloat(invoiceAmount!).toFixed(2)]
    .filter((item) => item !== '.')
    .reverse();
  const range = [...'MNOPQRSTUV'].reverse();
  const w_range = Math.min(floatStr.length, range.length);
  for (let i = 0; i < w_range; i++) {
    worksheet.getCell(`A${range[i]}6`).value = +floatStr[i];
  }

  const preValue = <CellRichTextValue>worksheet.getCell('I13').value;
  const content = preValue.richText;
  const toggle1 = invoiceType === '增值税专用发票' ? '☑' : '☐';
  const toggle2 = invoiceType === '增值税普通发票' ? '☑' : '☐';
  content[1].text = `${toggle1}`;
  content[3].text = `${toggle2}`;
  return await workbook.xlsx.writeBuffer();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleGHZXTemplate = async (
  query: ContractInvoiceRecord,
  path: string,
) => {
  const invoiceType = query.invoiceType;
  const companyName = query.contract.invoiceHeader.companyName;
  const contractNumber = query.contract.contractNumber;
  const invoiceAmount = query.invoiceAmount;
  const projectName = query.contract.projectName;
  const contactPhone = query.contract.invoiceHeader.contactPhone;
  const taxpayerIdentificationNumber =
    query.contract.invoiceHeader.taxpayerIdentificationNumber;
  const bankAccount = query.contract.invoiceHeader.bankAccount;
  const address = query.contract.invoiceHeader.address;
  const bankName = query.contract.invoiceHeader.bankName;
  const applicationDate = dayjs(query.invoiceTime);

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(path);

  const worksheet = workbook.getWorksheet(1)!;
  worksheet.getCell('I4').value = companyName;
  worksheet.getCell('Y4').value = contractNumber;
  if (invoiceType === '增值税专用发票') worksheet.getCell('AI4').value = '☑';
  else if (invoiceType === '增值税普通发票')
    worksheet.getCell('AI5').value = '☑';

  const floatStr = [...parseFloat(invoiceAmount!).toFixed(2)]
    .filter((item) => item !== '.')
    .reverse();
  const range = [...'EFAGHIJKLMN'].reverse();
  const bigRange = [...'IKMOQSUWY', 'AA'].reverse();
  const w_range = Math.min(floatStr.length, range.length);
  for (let i = 0; i < w_range; i++) {
    worksheet.getCell(`A${range[i]}7`).value = floatStr[i];
    worksheet.getCell(`${bigRange[i]}6`).value = NumberToChinese(floatStr[i]);
  }

  worksheet.getCell('I8').value = projectName;
  worksheet.getCell('I9').value = companyName;
  worksheet.getCell('AA9').value = contactPhone;
  worksheet.getCell('I10').value = taxpayerIdentificationNumber;
  worksheet.getCell('AA10').value = bankAccount;
  worksheet.getCell('I11').value = address;
  worksheet.getCell('AA11').value = bankName;

  worksheet.getCell('AG13').value = applicationDate.get('year').toString();
  worksheet.getCell('AK13').value = (
    applicationDate.get('months') + 1
  ).toString();
  worksheet.getCell('AM13').value = applicationDate.get('date').toString();

  return await workbook.xlsx.writeBuffer();
};
