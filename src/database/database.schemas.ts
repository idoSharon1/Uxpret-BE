import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Report, ReportSchema } from '../reports/schemas/report.schema';

export const ModelDefinitions = [
  // User model
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

  // Report model
  MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
];
