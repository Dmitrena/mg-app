export interface UserEvent {
  type: 'USER_CREATED' | 'USER_DELETED';
  data: {
    userId: string;
    email?: string;
    name?: string;
  };
}
