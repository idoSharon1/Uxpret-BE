import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReportDocument = Report & Document;


type WebsiteEvaluationCategory =
  "Is the color scheme match the website genre?"
  | "Usability"
  | "Visual Design"
  | "Performance & Speed"
  | "Accessibility"
  | "Content Quality & Readability"
  | "Navigation & Information Architecture"
  | "Mobile-Friendliness (Responsiveness)"
  | "User Engagement"
  | "Consistency";

export interface WebsiteEvaluation {
    category: WebsiteEvaluationCategory;
    text_rating: string;
    numeric_rating: number; // Assuming a scale of 1-10
    improvement_suggestions: {
        improvement: string;
        importance: number; // Assuming a scale of 1-10
        expected_improvement: number; // Assuming a scale of 1-10
    }
  }

export interface OverallEvaluation {
    category_ratings: WebsiteEvaluation[];
    final_score: number;
    best_thing: string;
    worst_thing: string;
    suggested_mew_html: string;
  }

const OverallEvaluationSchema = new MongooseSchema({
  category_ratings: [
    {
      category: { type: String, required: true },
      text_rating: { type: String, required: true },
      numeric_rating: { type: Number, required: true },
      improvement_suggestions : [{
        improvement: { type: String, required: true },
        importance: { type: Number, required: true },
        expected_improvement: { type: Number, required: true }
      }]
    },
  ],
  final_score: { type: Number, required: true },
  best_thing: { type: String, required: true },
  worst_thing: { type: String, required: true },
  suggested_mew_html: { type: String, required: true },
});

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

  @Prop({ type: OverallEvaluationSchema })
  results: OverallEvaluation;

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
