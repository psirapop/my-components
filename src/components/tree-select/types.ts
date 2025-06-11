export interface TreeNode {
  id: number;
  label: string;
  value: string;
  children?: TreeNode[];
}

export interface TreeNodeWithParent extends TreeNode {
  parentInfo?: {
    id: number;
    label: string;
    value: string;
  };
}

export interface PathItem {
  id: number;
  label: string;
}

export interface TreeSelectProps {
  /**
   * The data structure for the tree select component
   */
  data?: TreeNode[];

  /**
   * The currently selected value
   */
  value?: string;

  /**
   * Callback fired when the value changes
   * @param value The new value
   * @param label The label of the selected item
   */
  onChange?: (value: string, label: string) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Title for the component
   */
  title?: string;

  /**
   * The options for the tree select component
   */
  popperProps?: any;
}
