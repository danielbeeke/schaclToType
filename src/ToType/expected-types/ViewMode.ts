export type ViewMode = {
  type: string;
  name: string;
  targetClass: string;
  property: Array<{
    widget: string;
    path: string;
    widgetConfiguration?: Array<{
      key: string;
      value: string;
  }>;
  }>;
}
export default ViewMode