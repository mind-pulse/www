interface Tag {
  info?: string[];
  normal?: string[];
  warning?: string[];
  error?: string[];
}

interface ListItem {
  name: string;
  path: string;
  introduction: Texts;
  disabled?: boolean;
  warning?: string;
  tags: Tag;
}
