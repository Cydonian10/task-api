export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public roles: Role[] = [],
    public dateBirth?: Date,
  ) {}

  public static fromObject(object: Record<string, any>): User {
    const { id, name, email, roles, dateOfBirth } = object;
    const parsedDateBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    return new User(
      Number(id),
      String(name),
      String(email),
      (roles ?? []).map((role: string) => Role[role as keyof typeof Role] ?? role),
      parsedDateBirth,
    );
  }
}
