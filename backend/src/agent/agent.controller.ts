import { CurrentUser } from '../auth/decorator/loggedin-user';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ExpressRequestUser } from '../common/type/ExpressRequestUser';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AgentService } from './agent.service';
import { AgentResponseDto } from './dto/agent.response.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: ExpressRequestUser,
    @Body() createAgentDto: CreateAgentDto,
  ) {
    return this.agentService.create(createAgentDto, user.id);
  }

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @ApiResponse({
    description: 'Agent info with properties',
    type: AgentResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AgentResponseDto> {
    return plainToInstance(
      AgentResponseDto,
      await this.agentService.findOne(+id),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.update(+id, updateAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentService.remove(+id);
  }
}
