import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: MongooseSchema.Types.ObjectId,  required: true, auto: true })
  projectId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  name: string;

  @Prop()
  categories: string[];

  @Prop()
  audience: string[];

  @Prop()
  emotions: string[];

  @Prop()
  purpose: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);