import { isNaN, isNil, isNumber, isString } from "lodash-es";

type Connector = "AND" | "OR";

type ExpressionOperator =
  | "eq"
  | "ne"
  | "like"
  | "in"
  | "nin"
  | "gt"
  | "ge"
  | "lt"
  | "le"
  /**
   * 相对时间早于（LE），仅可用于时间类型字段
   */
  | "bf"
  /**
   * 相对时间早于晚于(GE)，仅可用于时间类型字段
   */
  | "af"
  /**
   * 月份中的上旬、下旬，仅可用于时间类型字段
   */
  | "monthPeriod"
  /**
   * 时间范围限定（月、日）,如生日（当月，两个月后，当日，十五日后）
   */
  | "dateRange"
  | "empty"
  /**
   * 月份在几月，仅可用于时间类型字段
   */
  | "monthIn";

const getExpression = (
  params: Record<
    string,
    undefined | null | string | number | boolean | (string | number)[]
  >,
) => {
  const p: any[] = [];
  for (const [k, v] of Object.entries(params)) {
    p.push({
      name: k,
      value: v,
    });
  }
  return getComplexExpression(p);
};

const getComplexExpression = (
  paramsList: {
    name: string;
    value: any;
    operator?: ExpressionOperator;
    connector?: Connector;
  }[] = [],
  extraExpression = "",
) => {
  if (!paramsList?.length) return extraExpression;
  let expression = ``;
  expression = paramsList.reduce(
    (pre, { name, value, operator = "eq", connector = "AND" }) => {
      if (
        isNil(value) ||
        (isNumber(value) && isNaN(value)) ||
        (isString(value) && value?.trim() === "")
      ) {
        return pre;
      }
      //如果是id属性，只能通过eq查找，准确的说，如果是mongo的ObjectId类型的主键，只能通过eq查找
      if (name === "id" && (!operator || operator === "like")) {
        operator = "eq";
      }
      //如果value是string类型，加上单引号，主要为了解决string中包含空格时表达式报错的问题
      return pre + ` ${connector} ${name} ${operator} ${String(value)}`;
    },
    expression,
  );
  expression = expression
    ?.slice((paramsList?.[0]?.connector || "AND")?.length + 2)
    ?.trim();
  return expression + (extraExpression ? " AND " + extraExpression : "");
};

export { getComplexExpression, getExpression };
