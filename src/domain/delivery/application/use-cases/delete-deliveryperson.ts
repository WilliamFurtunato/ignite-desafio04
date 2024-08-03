import { Either, left, right } from '@/core/either'
import { Deliveryperson } from '../../enterprise/entities/deliveryperson'
import { DeliverypersonRepository } from '../repositories/deliveryperson-repository'
import { UserRole } from '@/core/enums/UserRole'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface DeleteDeliverypersonUseCaseRequest {
  adminId: string
  deliverypersonId: string
}

type DeleteDeliverypersonUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    deliveryperson: Deliveryperson
  }
>

export class DeleteDeliverypersonUseCase {
  constructor(
    private deliverypersonRepository: DeliverypersonRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    deliverypersonId,
  }: DeleteDeliverypersonUseCaseRequest): Promise<DeleteDeliverypersonUseCaseResponse> {
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
      return left(new UserNotFoundError(deliverypersonId))
    }

    await this.deliverypersonRepository.delete(deliverypersonId)

    return right({
      deliveryperson,
    })
  }
}
