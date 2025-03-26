import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema()
export class Report {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  name: string;

  @Prop({
    required: true,
    enum: ['processing', 'analyzing', 'completed', 'failed'],
  })
  status: string;

  @Prop({ type: Object })
  results: any;

  @Prop()
  pdfUrl: string;

  @Prop()
  error: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  completedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
