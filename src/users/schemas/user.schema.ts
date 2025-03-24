import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop() // password is not required because we can authenticate with Google
  password?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop() // Google ID
  googleId?: string;

  @Prop() // Picture Profile
  picture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
