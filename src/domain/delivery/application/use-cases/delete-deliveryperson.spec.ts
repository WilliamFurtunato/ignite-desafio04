import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { DeleteDeliverypersonUseCase } from './delete-deliveryperson'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository

let sut: DeleteDeliverypersonUseCase

describe('Delete Deliveryperson', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()

    sut = new DeleteDeliverypersonUseCase(
      inMemoryDeliverypersonRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to delete a Deliveryperson name', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    await sut.execute({
      adminId: admin.id.toString(),
      deliverypersonId: deliveryperson.id.toString(),
    })

    expect(inMemoryDeliverypersonRepository.items).toHaveLength(0)
  })
})
