import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService {
 constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}
  
  findAllUsersProjects(userId: string) {
    return this.projectModel.find({ userId }).exec().then((projects) => {
      if (!projects) {
        throw new NotFoundException(`No projects found for user with ID "${userId}"`);
      }
      return projects;
    });
  }

  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  findOne(id: number) {
    return this.projectModel.findById({ id }).exec().then((project) => {
      if (!project) {
        throw new NotFoundException(`No project found with ID "${id}"`);
      }
      return project;
    });  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
function InjectModel(name: string): (target: typeof ProjectsService, propertyKey: undefined, parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

