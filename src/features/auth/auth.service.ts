import { LoginDto } from "./dtos/login-dto";
import { Result } from "@/src/common/entities/result";
import { BcryptAdapter } from "@/src/common/adapters/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter";
import { Payload } from "@/src/common/entities/payload";
import { AppDataSource } from "@/src/database/data-source";
import { UserEntity } from "@/src/database/entities/user.entity";

export class AuthService {
  private readonly repo = AppDataSource.getRepository(UserEntity);

  loginUser = async (dto: LoginDto): Promise<Result<{ token: string }>> => {
    const user = await this.repo.findOne({ where: { email: dto.email } });

    if (!user) {
      return Result.error("Invalid email or password", 401);
    }

    const isMatchPassword = BcryptAdapter.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isMatchPassword) {
      return Result.error("Invalid email or password", 401);
    }

    const token = await this.generateToken(
      Payload.fromObject({ email: user.email }),
    );

    return Result.success({ token });
  };

  private generateToken = async (payload: Payload): Promise<string> => {
    const token = await JwtAdapter.generateToken(payload);
    return token;
  };
}
