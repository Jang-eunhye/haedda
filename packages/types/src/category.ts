export type CategoryColor =
  | 'red'
  | 'orange'
  | 'lime'
  | 'yellow'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'pink';

export interface TodoCategory {
  id: string;
  label: string;
  color: CategoryColor;
}
