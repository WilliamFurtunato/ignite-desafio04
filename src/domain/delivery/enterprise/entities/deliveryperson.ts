import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/UserRole'

export interface DeliverypersonProps {
  name: string
  cpf: string
  password: string
  role: UserRole.DELIVERYPERSON
  latitude: number
  longitude: number
}

export class Deliveryperson extends Entity<DeliverypersonProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.password
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: DeliverypersonProps, id?: UniqueEntityID) {
    const deliveryperson = new Deliveryperson(props, id)

    return deliveryperson
  }
}
