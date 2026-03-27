import { compare, hash } from 'bcryptjs'

export class BcryptHasher {
  async hash(value: string) {
    return hash(value, 6)
  }

  async compare(value: string, hashedValue: string) {
    return compare(value, hashedValue)
  }
}