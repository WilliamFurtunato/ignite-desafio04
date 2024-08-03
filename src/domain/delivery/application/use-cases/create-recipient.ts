import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface CreateRecipientUseCaseRequest {
  adminId: string
  name: string
  email: string
  latitude: number
  longitude: number
  zipCode: string
  address: string
}

type CreateRecipientUseCaseResponse = Either<
  UserAlreadyExistsError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class CreateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    name,
    email,
    latitude,
    longitude,
    zipCode,
    address,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== admin?.role) {
      return left(new NotAllowedError())
    }

    const recipientWithSameEmail =
      await this.recipientRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const recipient = Recipient.create({
      name,
      email,
      latitude,
      longitude,
      address,
      zipCode,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
