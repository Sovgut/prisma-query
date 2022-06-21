export type ConvertTypes = 'number' | 'boolean' | 'date' | 'date-string';
export type ParseValueResult = string | number | boolean | Date;
export type Value = string | string[] | number | boolean;

export interface Query {
  [property: string]: Value;
}

export interface ListNode {
  prev?: ListNode;
  current: QueryScheme;
  next?: ListNode;
}

export interface QueryScheme {
  key: string;
  /**
   * @description Should value to be converted to passed type
   */
  parse?: ConvertTypes;
  /**
   * @description Can be skipped if value is undefined
   */
  optional?: boolean;
  /**
   * @description Custom hook for additional validation
   */
  onValidate?: (value: unknown) => boolean;
  /**
   * @description Used as a key or hook for the injecting to result container
   */
  containerKey?: ((value: unknown, key?: string, container?: any) => any) | string;
}
