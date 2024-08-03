import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateOrderUseCase } from './create-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository

let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()

    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to create a new Recipient', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const recipient = makeRecipient()
    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString(),
      packageName: 'package 01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrderRepository.items[0],
    })
  })
})
