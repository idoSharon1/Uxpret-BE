import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Report, ReportSchema } from '../reports/schemas/report.schema';
import { Project, ProjectSchema } from 'src/projects/schemas/project.schema';

export const ModelDefinitions = [
  // User model
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

  // Report model
  MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  
  // Project model
  MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
];
