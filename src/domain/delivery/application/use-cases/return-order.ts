import { Either, left, right } from '@/core/either'
import { UserRole } from '@/core/enums/UserRole'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

interface ReturnOrderUseCaseRequest {
  adminId: string
  orderId: string
  deliverypersonId: string
}

type ReturnOrderUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class ReturnOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    deliverypersonId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== admin?.role) {
      return left(new NotAllowedError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (order.deliverypersonId !== deliverypersonId) {
      return left(new NotAllowedError())
    }

    order.status = 'returned'
    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
