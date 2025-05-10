import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { AnalyzeWebsiteDto } from 'src/website/dto/analyze-website.dto';
import { WebsiteService } from 'src/website/website.service';

@Injectable()
export class ProjectsService {
 constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly websiteService: WebsiteService
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

    createdProject.save();

    //After creating the project, we can analyze the website
    const analyzeWebsiteDto: AnalyzeWebsiteDto = {
      url: createProjectDto.url,
      name: createProjectDto.name,
      categories: createProjectDto.categories,
      audience: createProjectDto.audience,
      emotions: createProjectDto.emotions,
      purpose: createProjectDto.purpose,
      includeScreenshots: createProjectDto.includeScreenshots,
      deepAnalysis: createProjectDto.deepAnalysis,
      projectId: createdProject._id as string,
    };
    
    // Call the analyze method from the website service
    // Passing the userId and email from createProjectDto
    return this.websiteService.analyze(analyzeWebsiteDto, createProjectDto.userId, createProjectDto.email);
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