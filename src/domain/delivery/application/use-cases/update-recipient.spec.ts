import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { UpdateRecipientUseCase } from './update-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository

let sut: UpdateRecipientUseCase

describe('Update Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new UpdateRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to update a new Recipient', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient = makeRecipient()
    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      name: 'John Doe',
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(inMemoryRecipientRepository.items[0]).toMatchObject({
      name: 'John Doe',
    })
  })
})
