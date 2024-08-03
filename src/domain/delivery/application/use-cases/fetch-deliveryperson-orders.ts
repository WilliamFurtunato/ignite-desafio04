import { Either, left, right } from '@/core/either'
import { DeliverypersonRepository } from '../repositories/deliveryperson-repository'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

interface FetchDeliverypersonOrdersUseCaseRequest {
  adminId: string
  deliverypersonId: string
}

type FetchDeliverypersonOrdersUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    orders: Order[]
  }
>

export class FetchDeliverypersonOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliverypersonRepository: DeliverypersonRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    deliverypersonId,
  }: FetchDeliverypersonOrdersUseCaseRequest): Promise<FetchDeliverypersonOrdersUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== admin?.role) {
      return left(new NotAllowedError())
    }

    const deliveryperson =
      await this.deliverypersonRepository.findById(deliverypersonId)

    if (!deliveryperson) {
      return left(new UserAlreadyExistsError(deliverypersonId))
    }

    const orders =
      await this.orderRepository.findManyByDeliverypersonId(deliverypersonId)

    return right({
      orders,
    })
  }
}
