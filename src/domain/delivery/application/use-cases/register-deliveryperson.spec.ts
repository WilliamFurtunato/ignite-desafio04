import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { RegisterDeliverypersonUseCase } from './register-deliveryperson'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliverypersonUseCase

describe('Register Deliveryperson', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliverypersonUseCase(
      inMemoryDeliverypersonRepository,
      inMemoryAdminRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new Deliveryperson', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
      latitude: -23.599838,
      longitude: -46.718845,
      userId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryperson: inMemoryDeliverypersonRepository.items[0],
    })
  })

  it('should hash Deliveryperson password upon registration', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
      latitude: -23.599838,
      longitude: -46.718845,
      userId: admin.id.toString(),
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverypersonRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register a new Deliveryperson without permission', async () => {
    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
      latitude: -23.599838,
      longitude: -46.718845,
      userId: deliveryperson.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
