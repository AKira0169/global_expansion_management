import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResearchDocumentDocument = HydratedDocument<ResearchDocument>;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ type: String, required: true, index: true })
  projectId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [String], required: true })
  tags: string[];
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);

ResearchDocumentSchema.index({ title: 'text', content: 'text' });
ResearchDocumentSchema.index({ projectId: 1, createdAt: -1 });
ResearchDocumentSchema.index({ tags: 1 });
