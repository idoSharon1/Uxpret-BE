import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { AnalyzeWebsiteDto } from 'src/website/dto/analyze-website.dto';

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

  findOne(id: ObjectId) {
    return this.projectModel.findById({ id }).exec().then((project) => {
      if (!project) {
        throw new NotFoundException(`No project found with ID "${id}"`);
      }
      return project;
    }); 
  }

  // Create a new project and analyze the website
  async create(createProjectDto: CreateProjectDto): Promise<any> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
    });

    await createdProject.save();
    return true;
  }

  update(id: ObjectId, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true }).exec().then((project) => {
      if (!project) { 
        throw new NotFoundException(`No project found with ID "${id}"`);
      }
      return true;
    });
  }

  remove(id: ObjectId) {
    return this.projectModel.findByIdAndDelete(id).exec().then((project) => {
      if (!project) {
        throw new NotFoundException(`No project found with ID "${id}"`);
      }
      return true;
    });
  }
}