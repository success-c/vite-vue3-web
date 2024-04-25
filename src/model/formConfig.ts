export interface FormConfig {
  formItems: any[];
}
export interface Props {
  formConfig: FormConfig;
  request: (props?: any) => Promise<any>;
}
