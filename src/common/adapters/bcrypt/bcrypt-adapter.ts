import { compareSync, hashSync } from "bcrypt";

export class BcryptAdapter {
  static hash(password: string): string {
    const passwordHash = hashSync(password, 10);
    return passwordHash;
  }

  static compare(password: string, hash: string): boolean {
    const isMatch = compareSync(password, hash);
    return isMatch;
  }
}
