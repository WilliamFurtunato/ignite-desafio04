import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { RegisterAdminUseCase } from './register-admin'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher

let sut: RegisterAdminUseCase

describe('Register Admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterAdminUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it('should be able to register a new admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminRepository.items[0],
    })
  })

  it('should hash admin password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminRepository.items[0].password).toEqual(hashedPassword)
  })
})
