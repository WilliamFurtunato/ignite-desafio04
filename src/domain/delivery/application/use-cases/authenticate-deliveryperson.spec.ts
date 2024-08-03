import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateDeliverypersonUseCase } from './authenticate-deliveryperson'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'

let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateDeliverypersonUseCase

describe('Authenticate Deliveryperson', () => {
  beforeEach(() => {
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverypersonUseCase(
      inMemoryDeliverypersonRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a deliveryperson', async () => {
    const deliveryperson = makeDeliveryperson({
      cpf: '12345678910',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverypersonRepository.items.push(deliveryperson)

    const result = await sut.execute({
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
