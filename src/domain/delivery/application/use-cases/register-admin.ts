import { Either, left, right } from '@/core/either'
import { Admin } from '../../enterprise/entities/admin'
import { AdminRepository } from '../repositories/admin-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserRole } from '@/core/enums/UserRole'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    admin: Admin
  }
>

export class RegisterAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new UserAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf,
      password: hashedPassword,
      role: UserRole.ADMIN,
    })

    await this.adminRepository.create(admin)

    return right({
      admin,
    })
  }
}
