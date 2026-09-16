import { Types } from "mongoose";
import { User } from "../../../api/user/user.entity";

export type UserIdentity = {
  id: string;
  provider: string;
  credentials: {
    username: string;
    hashedPassword: string;
  };
  /** ObjectId in scrittura/query; User dopo populate (pre findOne nel model). */
  user: User | Types.ObjectId;
}
