import { Order } from '../../enterprise/entities/order'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}
export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract findManyByDeliverypersonId(
    deliverypersonId: string,
  ): Promise<Order[]>

  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
}
