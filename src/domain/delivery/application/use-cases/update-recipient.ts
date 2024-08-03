import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface UpdateRecipientUseCaseRequest {
  adminId: string
  recipientId: string
  name: string
}

type UpdateRecipientUseCaseResponse = Either<
  UserAlreadyExistsError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class UpdateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    name,
    recipientId,
  }: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== admin?.role) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new UserNotFoundError(recipientId))
    }

    recipient.name = name
    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
