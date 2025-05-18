import { type RbacModule } from './rbac-module';
import { type RbacRolePermission } from './rbac-role-permission';

export type RbacRole = {
  id?: number;
  label?: string;
  value?: string;
  rbac_role_permissions?: RbacRolePermission[];
  rbac_module?: RbacModule;
  created_at?: string;
  updated_at?: string;
};
