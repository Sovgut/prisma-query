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
  parse?: ConvertTypes | ((value: any) => any);
  /**
   * @description Can be skipped if value is undefined
   */
  optional?: boolean;
  /**
   * @description Custom hook for additional validation
   */
  onValidate?: (value: any) => boolean;
  /**
   * @description Used as a key or hook for the injecting to result container
   */
  onInject?: ((value: any, key?: string, container?: any) => any) | string;
}

export interface Property {
  onValidate(callback: (value: any) => boolean): Property;
  parse(type: ConvertTypes | ((value: any) => any)): Property;
  optional(): Property;
  onInject(callback: ((value: any, key?: string, container?: any) => any) | string): Property;
  extract(): QueryScheme;
}

export type QueryOptions = Property[];
