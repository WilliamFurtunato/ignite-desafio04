import { Deliveryperson } from '../../enterprise/entities/deliveryperson'

export abstract class DeliverypersonRepository {
  abstract findByCpf(cpf: string): Promise<Deliveryperson | null>
  abstract create(deliveryperson: Deliveryperson): Promise<void>
  abstract findById(id: string): Promise<Deliveryperson | null>
  abstract save(deliveryperson: Deliveryperson): Promise<void>
  abstract delete(id: string): Promise<void>
}
