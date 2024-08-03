import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeRecipient } from 'test/factories/make-recipient'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository

let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new DeleteRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to delete a Recipient name', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient = makeRecipient()
    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })
})
