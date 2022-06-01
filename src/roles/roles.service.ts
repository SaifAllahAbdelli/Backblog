import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      let role = this.roleRepo.create(createRoleDto);
      return await this.roleRepo.save(role);
    } catch (error) {
      if (error.constraint === "UQ_ccc7c1489f3a6b3c9b47d4537c5") {
        throw new ConflictException('Role exist');
      }else {
        throw new InternalServerErrorException('Error when creating role');
      }
    }
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return this.roleRepo.findOne(id);
  }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
