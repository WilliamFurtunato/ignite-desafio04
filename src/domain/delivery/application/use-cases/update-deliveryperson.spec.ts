import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { UpdateDeliverypersonUseCase } from './update-deliveryperson'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository

let sut: UpdateDeliverypersonUseCase

describe('Update Deliveryperson', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()

    sut = new UpdateDeliverypersonUseCase(
      inMemoryDeliverypersonRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to update a Deliveryperson name', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    await sut.execute({
      name: 'John Doe',
      adminId: admin.id.toString(),
      deliverypersonId: deliveryperson.id.toString(),
    })

    expect(inMemoryDeliverypersonRepository.items[0]).toMatchObject({
      name: 'John Doe',
    })
  })
})
