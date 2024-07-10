export default class UserDTO {
  constructor(user) {
    this.email = user.email;
    this.id = user.id;
    this.firtName = user.firstName;
    this.lastName = user.lastName;
    this.password = user.password;
    this.role = user.role;
    this.cartId = user.cartId;
    this.login = true;
    this.fullName = `${user.firstName} ${user.lastName}`;
  }
}