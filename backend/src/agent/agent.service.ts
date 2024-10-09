import { StorageFileService } from '../storage-file/storage-file.service';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly storageFileService: StorageFileService,
    private readonly userService: UserService,
  ) {}

  async create(createAgentDto: CreateAgentDto, userId: number) {
    try {
      const agentUser = await this.userService.findOne(userId, 'agent');
      if (agentUser.agent) {
        throw new BadRequestException('Agent info of this user already exists');
      }
      const agent = Object.assign(new Agent(), createAgentDto) as Agent;
      agent.user = agentUser;
      createAgentDto.agentImage &&
        (agent.agentImage = await this.storageFileService.findOne(
          createAgentDto.agentImage,
        ));
      return await this.agentRepository.save(agent);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @OnEvent('user.created')
  async handleUserCreatedEvent(userId: number) {
    console.log('handing user create event of id', userId);
    const agent = new Agent();
    agent.designation = 'Real Estate Agent';
    const agentUser = await this.userService.findOne(userId);
    agent.user = agentUser;
    return await this.agentRepository.save(agent);
  }

  async findAll() {
    return await this.agentRepository.find({
      relations: ['user', 'agentImage'],
      where: {
        user: {
          isVerified: true,
        },
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.agentRepository.findOneOrFail({
        relations: ['user', 'properties.propertyImages', 'agentImage'],
        where: {
          id: id,
        },
        // order: {
        //   properties: {
        //     updated_at: 'DESC',
        //   },
        // },
      });
    } catch (error) {
      throw new NotFoundException('Agent not found');
    }
  }

  async update(id: number, updateAgentDto: UpdateAgentDto) {
    try {
      let agent = await this.findOne(id);
      if (!agent) {
        throw new NotFoundException('Agent not found !');
      }
      agent = Object.assign(agent, {
        ...updateAgentDto,
      });

      updateAgentDto.agentImage &&
        (agent.agentImage = await this.storageFileService.findOne(
          updateAgentDto.agentImage,
        ));

      return this.agentRepository.save(agent);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
