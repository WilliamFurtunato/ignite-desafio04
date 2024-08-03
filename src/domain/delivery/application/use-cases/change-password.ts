import { Either, left, right } from '@/core/either'
import { Deliveryperson } from '../../enterprise/entities/deliveryperson'
import { DeliverypersonRepository } from '../repositories/deliveryperson-repository'
import { UserRole } from '@/core/enums/UserRole'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface ChangepasswordDeliverypersonUseCaseRequest {
  adminId: string
  deliverypersonId: string
  newPassword: string
}

type ChangepasswordDeliverypersonUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    deliveryperson: Deliveryperson
  }
>

export class ChangepasswordDeliverypersonUseCase {
  constructor(
    private deliverypersonRepository: DeliverypersonRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    newPassword,
    adminId,
    deliverypersonId,
  }: ChangepasswordDeliverypersonUseCaseRequest): Promise<ChangepasswordDeliverypersonUseCaseResponse> {
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

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    deliveryperson.password = hashedPassword
    await this.deliverypersonRepository.save(deliveryperson)

    return right({
      deliveryperson,
    })
  }
}
