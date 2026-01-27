export interface UserDTO {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
}

export interface CreateUserDTO extends Omit<UserDTO, 'id'> {}

export interface ValidationErrorDTO {
  error: string;
  message: string;
  fields?: Record<string, string>;
}
