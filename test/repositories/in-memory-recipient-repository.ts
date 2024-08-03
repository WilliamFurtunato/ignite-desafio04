import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }
}
