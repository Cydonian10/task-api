export class UserWithPassword {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
  ) {}

  public static fromEntity(object: Record<string, any>): UserWithPassword {
    const { id, name, email, password } = object;

    return new UserWithPassword(
      Number(id),
      String(name),
      String(email),
      String(password),
    );
  }
}
