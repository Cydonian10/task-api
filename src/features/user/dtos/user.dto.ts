import { UserEntity } from "@/src/database/entities/user.entity.js";
import { DateTime } from "luxon";

export class UserDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public roles: string[] = [],
    public age: number,
    public dateBirth: string,
  ) {}

  public static fromEntity(object: UserEntity): UserDto {
    const { id, name, email, roles, dateOfBirth } = object;

    const parsedDateBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

    const age = parsedDateBirth
      ? DateTime.now().diff(DateTime.fromJSDate(parsedDateBirth), "years").years
      : 0;

    return new UserDto(
      Number(id),
      String(name),
      String(email),
      roles,
      Math.trunc(age),
      DateTime.fromJSDate(parsedDateBirth!, { zone: "utc" }).toFormat(
        "yyyy-MM-dd",
      )!,
    );
  }
}
