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
}
