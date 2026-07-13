export class Payload {
  constructor(public email: string, public exp?: number) {}

  static fromObject(obj: Record<string, any>): Payload {
    const { email, exp } = obj;
    return new Payload(String(email), exp ? Number(exp) : 0);
  }
}
