import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ResearchDocument {
  @Prop({ type: String, required: true })
  projectId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [String], required: true })
  tags: string[];
}
