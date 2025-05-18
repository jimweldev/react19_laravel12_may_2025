import { type RbacModule } from './rbac-module';

export type RbacPermission = {
  id?: number;
  label?: string;
  value?: string;
  rbac_module_id?: number;
  rbac_module?: RbacModule;
  created_at?: string;
  updated_at?: string;
};
