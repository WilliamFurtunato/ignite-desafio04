import { DeliverypersonRepository } from '@/domain/delivery/application/repositories/deliveryperson-repository'
import { Deliveryperson } from '@/domain/delivery/enterprise/entities/deliveryperson'

export class InMemoryDeliverypersonRepository
  implements DeliverypersonRepository
{
  public items: Deliveryperson[] = []

  async findByCpf(cpf: string) {
    const deliveryperson = this.items.find((item) => item.cpf === cpf)

    if (!deliveryperson) {
      return null
    }

    return deliveryperson
  }

  async create(deliveryperson: Deliveryperson) {
    this.items.push(deliveryperson)
  }

  async findById(id: string): Promise<Deliveryperson | null> {
    const deliveryperson = this.items.find((item) => item.id.toString() === id)

    if (!deliveryperson) {
      return null
    }

    return deliveryperson
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }

  async save(deliveryperson: Deliveryperson): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryperson.id,
    )

    this.items[itemIndex] = deliveryperson
  }
}
