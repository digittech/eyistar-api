import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { ServicesModule } from '../../services';
import { MailService } from '../../mail/mail.service';
import { ExportService } from 'src/services/export/export.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ServicesModule],
  controllers: [UserController],
  providers: [UserService, ExportService, MailService],
  exports: [UserService, ExportService, MailService],
})
export class UserModule {}
