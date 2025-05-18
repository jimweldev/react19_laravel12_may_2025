import { type RbacUserRole } from './rbac-user-role';

export type User = {
  id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  avatar?: string;
  email?: string;
  is_admin?: boolean;
  account_type?: string;
  rbac_user_roles?: RbacUserRole[];
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
};
