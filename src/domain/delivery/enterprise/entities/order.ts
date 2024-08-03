import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type OrderStatus = 'waiting' | 'collected' | 'delivered' | 'returned'

export interface OrderProps {
  deliverypersonId?: string
  recipientId: string
  status: OrderStatus
  packageName: string
}

export class Order extends Entity<OrderProps> {
  get status() {
    return this.props.status
  }

  set status(status: OrderStatus) {
    this.props.status = status
  }

  get deliverypersonId() {
    return this.props.deliverypersonId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get packageName() {
    return this.props.packageName
  }

  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id)

    return order
  }
}
