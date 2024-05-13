import { UtilsService } from "../utils/utils.service";
import { User } from "./user.entity";
import bcrypt from "bcryptjs";

interface ICreateUserServiceResponse {
  user: User | null;
  message: string;
}

export class UserService {
  private utilsService = new UtilsService();
  async createUser(
    userData: Partial<User>
  ): Promise<ICreateUserServiceResponse> {
    const encryptedPassword: string = await bcrypt.hash(
      userData.password || "",
      10
    );
    const newUser: User = await new User();
    newUser.first_name = userData.first_name || "";
    newUser.last_name = userData.last_name || "";
    newUser.email = userData.email || "";
    newUser.is_active = true;
    newUser.password = encryptedPassword;
    newUser.role = userData.role || "";
    newUser.user_id = this.utilsService.slugGenerator(
      newUser.first_name,
      newUser.last_name
    );
    const { fileAddStatus: isProfilePictureAdd, fileUrl: profilePictureUrl } =
      await this.utilsService.uploadAnyPicture(
        userData.profile_pic || "",
        userData.last_name || ""
      );

    if (isProfilePictureAdd) {
      newUser.profile_pic = profilePictureUrl;
      const saveNewUser = await newUser.save();
      if (Object.keys(saveNewUser).length) {
        return {
          message: "User successfully created",
          user: saveNewUser,
        };
      } else {
        return {
          message: "User create failed",
          user: null,
        };
      }
    } else {
      return {
        message: "Image upload failed",
        user: null,
      };
    }
  }
  async updateUserById(userid: string): Promise<{ status: number }> {
    console.log(userid);
    return {
      status: 202,
    };
  }
  async getUserByEmail(emaiL: string): Promise<User | null> {
    try {
      const user = await User.createQueryBuilder("user")
        .where("user.email = :e", { e: emaiL })
        .andWhere("user.is_active = :active", { active: true })
        .select([
          "user.first_name",
          "user.user_id",
          "user.last_name",
          "user.email",
          "user.is_active",
          "user.role",
        ])
        .getOne();
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async verifyPasswordByUserId(
    useId: string,
    inputPasword: string
  ): Promise<{ status: boolean; message: string }> {
    try {
      const getRequestedUser = await this.getUserById(useId);
      if (getRequestedUser) {
        const getHashedPasswordOfReceivedUser = await this.getUserPasswordById(
          getRequestedUser.user_id
        );
        const isMatch = await bcrypt.compare(
          inputPasword,
          getHashedPasswordOfReceivedUser
        );
        if (isMatch) {
          return {
            status: true,
            message: "Password Matched!!!",
          };
        } else {
          return {
            status: false,
            message: "Password Not Match",
          };
        }
      } else {
        return {
          status: false,
          message: "User Not Found!!!",
        };
      }
    } catch (err) {
      console.log(err.message);
      return {
        status: false,
        message: err.message,
      };
    }
  }
  private async getUserPasswordById(userId: string): Promise<string> {
    try {
      const getPasswordOfUserByUserId = await User.createQueryBuilder("user")
        .where("user.user_id = :userId", { userId })
        .select(["user.password"])
        .getOne();
      if (getPasswordOfUserByUserId) {
        return getPasswordOfUserByUserId.password;
      } else {
        return "";
      }
    } catch (err) {
      return err.message;
    }
  }
  async getUserById(userId: string): Promise<User | null> {
    try {
      const findUser = await User.createQueryBuilder("user")
        .where("user.user_id = :userId", { userId })
        .andWhere("user.is_active = true")
        .select([
          "user.first_name",
          "user.last_name",
          "user.is_active",
          "user.email",
          "user.profile_pic",
          "user.create_at",
          "user.update_at",
          "user.user_id",
          "user.role",
        ])
        .getOne();
      if (findUser) {
        return findUser;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
  async deleteUserById(userId: number): Promise<{ status: number }> {
    console.log(userId);
    return {
      status: 202,
    };
  }
}
