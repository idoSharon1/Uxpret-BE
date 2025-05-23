import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { WebsiteModule } from 'src/website/website.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
