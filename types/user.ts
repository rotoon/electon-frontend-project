import { PaginationMeta } from "./common";
import { Constituency, District, Province } from "./location";

export interface User {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;
  province: Province;
  district: District;
  constituency: Constituency;
  roles: string[];
  createdAt: string;
}

export interface ManageUsersResult {
  users: User[];
  meta: PaginationMeta;
}
