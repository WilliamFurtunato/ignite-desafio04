import { Either, right } from '@/core/either'

import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

type FetchNearbyOrdersUseCaseRequest = {
  latitude: number
  longitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchNearbyOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.orderRepository.findManyNearby({
      latitude,
      longitude,
    })

    return right({ orders })
  }
}
