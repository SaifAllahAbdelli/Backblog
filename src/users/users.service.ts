import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from './authorisation/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let { password, roleId, ...userInfo } = createUserDto;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.repo.create({
      ...userInfo,
      roleId,
      password: hashedPassword,
    });

    try {
      let createdUser = await this.repo.save(user);
      delete user.password;
      return createdUser;
    } catch (error) {
      console.log(error);

      if (error.constraint === 'UNIQUE_EMAIL') {
        throw new ConflictException(
          "Email '" + user.email + "' already exists",
        );
      } else {
        throw new InternalServerErrorException('Error when creating user');
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    // const user = await this.findOne({ email });
    const user = await this.repo
      .createQueryBuilder('user')
      .select('user')
      .addSelect('user.password')
      .where({ email })
      .getOne();

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email, id: user.id, roleId: user.roleId };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async findOne(conditions) {
    return this.repo.findOne(conditions);
  }

  async delete(conditions) {
    return this.repo.delete(conditions);
  }

  async findUser(conditions) {
    try {
      let foundUser;
      foundUser = await this.repo.findOne(conditions);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      return foundUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(createUserDto, jwtUser) {
    let foundUser = await this.findUser({ email: jwtUser.email });
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      await this.repo.update(foundUser.id, {
        ...createUserDto,
        password: hashedPassword,
      });
      let newUser = await this.findUser({ email: jwtUser.email });
      delete newUser.password;
      return { ...newUser };
    } catch (error) {
      console.log(error);
      if (error.constraint === 'UNIQUE_EMAIL') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
