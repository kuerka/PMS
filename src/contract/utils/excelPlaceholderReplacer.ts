import type { CellRichTextValue, Workbook } from 'exceljs';

type Placeholder = {
  placeholderPrefix: string;
  placeholderSuffix: string;
};

type Replacements = Record<string, string | number>;

const matchPlaceholder = (
  cellValue: string,
  replacements: Replacements,
  options: Placeholder,
) => {
  const { placeholderPrefix = '${', placeholderSuffix = '}' } = options;
  const regex = new RegExp(
    `${escapeRegExp(placeholderPrefix)}(.*?)${escapeRegExp(placeholderSuffix)}`,
    'g',
  );
  let updatedValue = cellValue;

  // 替换所有找到的占位符
  let match: RegExpExecArray | null;
  while ((match = regex.exec(cellValue)) !== null) {
    const placeholder = match[1];
    // 如果替换映射中存在该占位符，则进行替换
    if (!(placeholder in replacements)) continue;
    const replacement = replacements[placeholder];
    // 确保替换值是字符串类型
    const replacementValue =
      typeof replacement === 'string' ? replacement : String(replacement);
    if (typeof replacement !== 'string') {
      updatedValue = replacement as unknown as string;
    } else {
      // 使用正则表达式进行替换，确保只替换完整的占位符
      const placeholderRegex = new RegExp(`${escapeRegExp(match[0])}`, 'g');
      updatedValue = updatedValue.replace(placeholderRegex, replacementValue);
    }
  }

  // 如果值发生了变化，则更新单元格
  if (updatedValue !== cellValue) {
    return updatedValue;
  } else {
    return false;
  }
};
export function replacePlaceholdersInExcel(
  workbook: Workbook,
  replacements: Replacements,
  options: Placeholder,
): void {
  // 创建工作簿实例并加载输入文件

  // 遍历所有工作表
  workbook.eachSheet((worksheet) => {
    // 遍历工作表的每一行
    worksheet.eachRow((row) => {
      // 遍历行中的每个单元格
      row.eachCell((cell) => {
        // 检查单元格是否包含字符串值
        if (typeof cell.value === 'string') {
          const res = matchPlaceholder(cell.value, replacements, options);
          if (res !== false) cell.value = res;
        } else if ((<CellRichTextValue>cell.value)?.richText) {
          const richText = (<CellRichTextValue>cell.value).richText;
          richText.forEach((text) => {
            const res = matchPlaceholder(text.text, replacements, options);
            if (res !== false) text.text = res;
          });
        }
      });
    });
  });
}

/**
 * 转义正则表达式特殊字符
 * @param {string} str - 输入字符串
 * @returns {string} - 转义后的字符串
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
