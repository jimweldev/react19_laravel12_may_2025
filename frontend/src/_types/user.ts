import { type RbacUserRole } from './rbac-user-role';
import type { UserSetting } from './user-setting';

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
  user_setting?: UserSetting;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
};
