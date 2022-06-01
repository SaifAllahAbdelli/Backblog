import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, jwtUser): Promise<any> {
    try {
      let newPost = this.postRepo.create({
        ...createPostDto,
        dateOfCreation: new Date(),
        user: jwtUser,
      });
      return await this.postRepo.save(newPost);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('error from the server');
    }
  }

  async findOne(id): Promise<any> {
    let post = await this.postRepo.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async find(jwtUser): Promise<any> {
    let post = await this.postRepo.find({
      where: {
        user: jwtUser,
      },
    });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    const allPost = post.map((el) => {
      return {
        id: el.id,
        title: el.title,
        description: el.description,
        text: el.text,
        picture: el.picture,
        dateOfCreation: el.dateOfCreation,
        dateOfUpdate: el.dateOfUpdate,
        category: el.category,
        user: {
          id: el.user.id,
          email: el.user.email,
          firstName: el.user.firstName,
          lastName: el.user.lastName,
          photo: el.user.photo,
          roleId: el.user.role.role,
        },
      };
    });
    return Promise.all(allPost);
  }

  async findAll(): Promise<any> {
    let post = await this.postRepo.find();
    if (!post) {
      throw new NotFoundException('no post found');
    }
    const allPost = post.map((el) => {
      return {
        id: el.id,
        title: el.title,
        description: el.description,
        text: el.text,
        picture: el.picture,
        dateOfCreation: el.dateOfCreation,
        dateOfUpdate: el.dateOfUpdate,
        category: el.category,
        user: {
          id: el.user.id,
          email: el.user.email,
          firstName: el.user.firstName,
          lastName: el.user.lastName,
          photo: el.user.photo,
          roleId: el.user.role.role,
        },
      };
    });
    return Promise.all(allPost);
  }

  async update(
    id: number,
    createPostDto: CreatePostDto,
    jwtUser,
  ): Promise<any> {
    await this.findOne(id);

    try {
      await this.postRepo.update(id, {
        ...createPostDto,
        dateOfUpdate: new Date(),
        user: jwtUser,
      });
      let updatedPost = await this.postRepo.find({ id });
      return {
        id: updatedPost[0].id,
        title: updatedPost[0].title,
        description: updatedPost[0].description,
        text: updatedPost[0].text,
        picture: updatedPost[0].picture,
        dateOfCreation: updatedPost[0].dateOfCreation,
        dateOfUpdate: updatedPost[0].dateOfUpdate,
        category: updatedPost[0].category,
        user: {
          id: updatedPost[0].user.id,
          email: updatedPost[0].user.email,
          firstName: updatedPost[0].user.firstName,
          lastName: updatedPost[0].user.lastName,
          photo: updatedPost[0].user.photo,
          roleId: updatedPost[0].user.role.role,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('error from the server');
    }
  }

  async remove(id: number, jwtUser): Promise<any> {
    let post = await this.postRepo.findOne(id);
    if (jwtUser.roleId == 1) {
      let found = await this.postRepo.delete({ id });
      if (found.affected === 0) throw new NotFoundException();
      {
        return { removePost: 'post removed successfully' };
      }
    } else if (post.user.email === jwtUser.email) {
      let found = await this.postRepo.delete({ id });
      if (found.affected === 0) throw new NotFoundException();
      {
        return { removePost: 'post removed successfully' };
      }
    }
  }
}
