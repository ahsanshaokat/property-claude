import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StorageFileService } from './storage-file.service';
import { CreateStorageFileDto } from './dto/create-storage-file.dto';
import { UpdateStorageFileDto } from './dto/update-storage-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Storage File')
@Controller('storage-file')
export class StorageFileController {
  constructor(private readonly storageFileService: StorageFileService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('fileName', {
      storage: diskStorage({
        // destination: './public/uploads/floor_plan',
        // destination: (req: Request, file: Express.Multer.File, cb: any) => {
        //   const destinationPath = `./public/uploads/${req.body.type}`;
        //   if (!fs.existsSync(destinationPath)) {
        //     fs.mkdirSync(destinationPath, { recursive: true });
        //   }
        //   cb(null, `${destinationPath}`);
        // },
        filename: (req: Request, file: Express.Multer.File, cb: any) => {
          const randomName = uuidv4();
          const fileName = `${Date.now()}time${randomName
            .split('-')
            .join('')}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  create(
    @Body() createStorageFileDto: CreateStorageFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.storageFileService.create(createStorageFileDto, file);
  }

  @Get()
  findAll() {
    return this.storageFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageFileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStorageFileDto: UpdateStorageFileDto,
  ) {
    return this.storageFileService.update(+id, updateStorageFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageFileService.remove(+id);
  }
}
