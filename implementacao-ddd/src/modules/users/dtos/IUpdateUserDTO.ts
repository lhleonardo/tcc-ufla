export default interface IUpdateUserDTO {
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}
