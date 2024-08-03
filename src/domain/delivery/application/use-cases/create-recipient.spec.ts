import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { CreateRecipientUseCase } from './create-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository

let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new CreateRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to create a new Recipient', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      name: 'John Doe',
      latitude: -23.599838,
      longitude: -46.718845,
      adminId: admin.id.toString(),
      address: 'street',
      email: 'johndoe@example.com',
      zipCode: '00001111',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
  })
})
