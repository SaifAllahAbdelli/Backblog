import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/authorisation/roles.guard';
import { Role } from 'src/users/authorisation/role.enum';
import { GetUser } from 'src/users/get-user.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@ApiBearerAuth()
@Controller('api/posts')
@ApiTags('posts-controller')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(RolesGuard([Role.ADMIN, Role.DEVELOPER]))
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() jwtUser) {
    return this.postService.create(createPostDto, jwtUser);
  }

  @Get('')
  findAll() {
    return this.postService.findAll();
  }
  
  @UseGuards(RolesGuard([Role.ADMIN, Role.DEVELOPER]))
  @Get('/my-posts')
  find(@GetUser() jwtUser) {
    return this.postService.find(jwtUser);
  }

  @UseGuards(RolesGuard([Role.ADMIN, Role.DEVELOPER]))
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
    @GetUser() jwtUser,
  ) {
    return this.postService.update(id, createPostDto, jwtUser);
  }

  @UseGuards(RolesGuard([Role.ADMIN, Role.DEVELOPER]))
  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() jwtUser) {
    return this.postService.remove(id, jwtUser);
  }
}
