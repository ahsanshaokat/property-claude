/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';
import { Company } from './entities/company.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        private readonly userService: UserService,
    ) { }

    async create(createCompanyDto: CreateCompanyDto) {

        const user = await this.userService.findOne(createCompanyDto.userId);

        if (!user) {
            throw new Error('User not found');
        }

        const company = this.companyRepository.create({
            ...createCompanyDto,
            user,
        });

        return this.companyRepository.save(company);
    }

    async findAll() {
        return await this.companyRepository.find({ relations: ['projects'] });
    }

    async findOne(id: number) {
        const company = await this.companyRepository.findOne({
            where: { id }, // Using 'where' to specify the condition
            relations: ['projects'], // Fetch related projects
        });
        if (!company) {
            throw new NotFoundException(`Company with id ${id} not found`);
        }
        return company;
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto) {
        const company = await this.findOne(id);
        Object.assign(company, updateCompanyDto);
        return await this.companyRepository.save(company);
    }

    async remove(id: number) {
        const company = await this.findOne(id);
        return await this.companyRepository.remove(company);
    }
}
