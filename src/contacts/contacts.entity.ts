
export class Contact {
  id: number;
  name: string;
  email: string;
  description: string;

  constructor(data?: Partial<Contact>) {
    Object.assign(this, data);
  }
}
