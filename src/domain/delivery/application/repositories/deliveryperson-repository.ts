import { Deliveryperson } from '../../enterprise/entities/deliveryperson'

export abstract class DeliverypersonRepository {
  abstract findByCpf(cpf: string): Promise<Deliveryperson | null>
  abstract create(deliveryperson: Deliveryperson): Promise<void>
}
