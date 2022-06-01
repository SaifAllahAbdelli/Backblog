import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './entities/user.entity';
import { CreateUserDto, updateUserDto } from './dto/create-user.dto';
import { RolesGuard } from './authorisation/roles.guard';
import { Role } from './authorisation/role.enum';

@ApiBearerAuth()
@ApiTags('authentification-controller')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard([Role.ADMIN]))
  @Post('/signUp')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    //send email with passwrod to user
    return this.usersService.create(createUserDto);
  }

  @Post('/signIn')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.signIn(authCredentialsDto);
  }

  @UseGuards(RolesGuard([Role.ADMIN, Role.DEVELOPER]))
  @Put('/update-profile/:id')
  update(
    @Body() authCredentialsDto: updateUserDto,
    @GetUser() jwtUser,
  ): Promise<any> {
    return this.usersService.update(authCredentialsDto, jwtUser);
  }
}
