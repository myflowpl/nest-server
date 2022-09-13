import { Exclude, Transform } from "class-transformer";

export class Contact {
  id: number;

  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true})
  @Transform(({ value }) => value.toUpperCase(), { toPlainOnly: true})
  name: string;

  // @Exclude()
  email: string;
  message: string;
}
