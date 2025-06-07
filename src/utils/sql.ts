import { SelectQueryBuilder } from 'typeorm';

export function safeLeftJoinAndSelect(
  qb: SelectQueryBuilder<any>,
  relation: string,
  alias: string,
) {
  const alreadyJoined = qb.expressionMap.joinAttributes.some(
    (join) => join.alias.name === alias,
  );

  if (!alreadyJoined) qb.leftJoinAndSelect(relation, alias);
}
