import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  email: string
  latitude: number
  longitude: number
  zipCode: string
  address: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  get zipCode() {
    return this.props.zipCode
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
