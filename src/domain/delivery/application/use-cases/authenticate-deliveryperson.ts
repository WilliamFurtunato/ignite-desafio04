import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverypersonRepository } from '../repositories/deliveryperson-repository'

interface AuthenticateDeliverypersonUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliverypersonUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliverypersonUseCase {
  constructor(
    private deliverypersonRepository: DeliverypersonRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverypersonUseCaseRequest): Promise<AuthenticateDeliverypersonUseCaseResponse> {
    const deliveryperson = await this.deliverypersonRepository.findByCpf(cpf)

    if (!deliveryperson) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryperson.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryperson.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
