import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { ChangepasswordDeliverypersonUseCase } from './change-password'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository
let fakeHasher: FakeHasher

let sut: ChangepasswordDeliverypersonUseCase

describe('Changepassword Deliveryperson', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangepasswordDeliverypersonUseCase(
      inMemoryDeliverypersonRepository,
      inMemoryAdminRepository,
      fakeHasher,
    )
  })

  it('should be able to changepassword a Deliveryperson name', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    const result = await sut.execute({
      newPassword: '6789',
      adminId: admin.id.toString(),
      deliverypersonId: deliveryperson.id.toString(),
    })

    const hashedPassword = await fakeHasher.hash('6789')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverypersonRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
