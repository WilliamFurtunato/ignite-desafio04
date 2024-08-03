import {
  FindManyNearbyParams,
  OrderRepository,
} from '@/domain/delivery/application/repositories/order-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { InMemoryRecipientRepository } from './in-memory-recipient-repository'
import { LocationService } from '@/domain/delivery/application/services/location-service'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(private recipientsRepository: InMemoryRecipientRepository) {}

  async create(order: Order) {
    this.items.push(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }

  async findManyByDeliverypersonId(deliverypersonId: string): Promise<Order[]> {
    return this.items.filter(
      (item) => item.deliverypersonId?.toString() === deliverypersonId,
    )
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    const recipients = this.recipientsRepository.items.filter((item) => {
      const distance = LocationService.getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      )

      return distance < 10
    })

    const recipientsIds = recipients.map((item) => item.id.toString())

    return this.items
      .filter((item) => item.status === 'waiting')
      .filter((item) => recipientsIds.includes(item.recipientId.toString()))
  }
}
