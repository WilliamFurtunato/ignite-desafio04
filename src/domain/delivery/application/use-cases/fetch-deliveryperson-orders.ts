import { Either, right } from '@/core/either'
import { UserRole } from '@/core/enums/UserRole'
import { AdminRepository } from '../repositories/admin-repository'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

interface FetchDeliverypersonOrdersUseCaseRequest {
  adminId: string
  deliverypersonId: string
}

type FetchDeliverypersonOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchDeliverypersonOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    deliverypersonId,
  }: FetchDeliverypersonOrdersUseCaseRequest): Promise<FetchDeliverypersonOrdersUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return null
    }
    if (UserRole.ADMIN !== admin?.role) {
      return null
    }
    const orders =
      await this.orderRepository.findManyByDeliverypersonId(deliverypersonId)

    return right({
      orders,
    })
  }
}
