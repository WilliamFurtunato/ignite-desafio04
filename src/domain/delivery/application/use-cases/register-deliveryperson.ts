import { Either, left, right } from '@/core/either'
import { Deliveryperson } from '../../enterprise/entities/deliveryperson'
import { DeliverypersonRepository } from '../repositories/deliveryperson-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface RegisterDeliverypersonUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
  latitude: number
  longitude: number
}

type RegisterDeliverypersonUseCaseResponse = Either<
  UserAlreadyExistsError | NotAllowedError,
  {
    deliveryperson: Deliveryperson
  }
>

export class RegisterDeliverypersonUseCase {
  constructor(
    private deliverypersonRepository: DeliverypersonRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    latitude,
    longitude,
    userId,
  }: RegisterDeliverypersonUseCaseRequest): Promise<RegisterDeliverypersonUseCaseResponse> {
    const user = await this.adminRepository.findById(userId)

    if (!user) {
      return left(new NotAllowedError())
    }
    if (UserRole.ADMIN !== user?.role) {
      return left(new NotAllowedError())
    }

    const deliverypersonWithSameCpf =
      await this.deliverypersonRepository.findByCpf(cpf)

    if (deliverypersonWithSameCpf) {
      return left(new UserAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryperson = Deliveryperson.create({
      name,
      cpf,
      password: hashedPassword,
      role: UserRole.DELIVERYPERSON,
      latitude,
      longitude,
    })

    await this.deliverypersonRepository.create(deliveryperson)

    return right({
      deliveryperson,
    })
  }
}
