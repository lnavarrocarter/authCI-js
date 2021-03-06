import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { UploadEntity } from './upload.entity'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UpDTO, UpRO } from "./upload.dto";
import { UserEntity } from "src/users/user.entity";

@Injectable()
export class UploadServices {
    constructor(
        @InjectRepository(UploadEntity)
        private uploadRepository: Repository<UploadEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>, 

    ){}

    async getFile(encodeName: any): Promise<UpRO>{
        let file = await this.uploadRepository.findOne({where : {encodefile : encodeName}, relations : ['author']});
        if(!file){
            throw new HttpException('No tenemos registro de este codigo de archivo: ' + encodeName, HttpStatus.BAD_REQUEST);
        }
        Logger.log('Archivo encontrado! : ' + JSON.stringify(file));
        return file.toResponseObject(true);
    }

    async saveUpload( UserId: any , data: UpDTO ): Promise<UpRO>{
        const user = await this.userRepository.findOne({where : { id : UserId } })
        if(!user){
            throw new HttpException('El usuario no existe o no tiene permisos para subir un archivo', HttpStatus.BAD_REQUEST);
        }
        const upload = await this.uploadRepository.create({ ...data, author: user })
        Logger.log('Upload Success! : ' + JSON.stringify(upload));
        await this.uploadRepository.save(upload);
        return upload.toResponseObject();
    }

    async getAllFiles(userId: number = 0): Promise<UpRO[]> {
        let files;
        if(userId != 0){
            files = await this.uploadRepository.find({where : { author : userId }, relations : ['author']});
        }else{
            files = await this.uploadRepository.find({relations : ['author']});
        }
        if(!files){
            throw new HttpException('No tenemos registros de archivos', HttpStatus.BAD_REQUEST);
        }
        Logger.log("Lista de archivos completa: " + JSON.stringify(files))
        return files.map(map => map.toResponseObject());
    }
}