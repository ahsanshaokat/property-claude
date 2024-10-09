import * as bcrypt from 'bcrypt';

export const passwordHash = (plainPassword: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};
