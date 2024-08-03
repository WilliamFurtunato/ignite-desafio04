import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRole } from '@/core/enums/UserRole'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface DeleteRecipientUseCaseRequest {
  adminId: string
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<
  UserNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class DeleteRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
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

    await this.recipientRepository.delete(recipientId)

    return right({
      recipient,
    })
  }
}
