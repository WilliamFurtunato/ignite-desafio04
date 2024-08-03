import { Either, left, right } from '@/core/either'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

interface CreateOrderUseCaseRequest {
  adminId: string
  recipientId: string
  packageName: string
}

type CreateOrderUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    packageName,
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== admin?.role) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new UserAlreadyExistsError(recipientId))
    }

    const order = Order.create({
      packageName,
      recipientId,
      status: 'waiting',
    })

    await this.orderRepository.create(order)

    return right({
      order,
    })
  }
}
