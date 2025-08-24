import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ObjectId } from 'mongoose';


@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
findAll() {
  return this.projectsService.findAll();
}

  @Get('users/projects/:userid')
  findAllUsersProjects(@Param('userid') userid: string) {
    return this.projectsService.findAllUsersProjects(userid);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.projectsService.findOne(id);
  }

  @Delete(':id')
  removeProject(@Param('id') id: ObjectId) {
    return this.projectsService.remove(id);
  }

  @Post("/new")
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }
}
