import {
  SelectFieldNames,
  SelectOptionData,
  SelectOptionGroup,
  TableColumnData
} from "@arco-design/web-vue";

export interface TableConfig {
  scroll?: { x?: number | string; y?: number | string };

  columns: Array<
    | TableColumnData
    | {
        noSearch?: boolean;
        type: "select" | "input" | "date";
        fieldNames: SelectFieldNames;
        options: (
          | string
          | number
          | boolean
          | SelectOptionData
          | SelectOptionGroup
        )[];
        renderItem: () => {};
      }
  >;
}

export interface Props {
  tableConfig: TableConfig;
  request: (props?: any) => Promise<any>;
}
