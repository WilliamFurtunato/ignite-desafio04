import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(id: string): Promise<void>
}
