import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'

let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchNearbyOrdersUseCase

describe('FetchNearbyOrderUseCase', () => {
  beforeEach(() => {
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )
    sut = new FetchNearbyOrdersUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch nearby order', async () => {
    const deliveryperson = makeDeliveryperson({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient1 = makeRecipient({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const recipient2 = makeRecipient({
      latitude: -27.0610928,
      longitude: -49.5229501,
    })
    const order1 = makeOrder({
      deliverypersonId: deliveryperson.id.toString(),
      recipientId: recipient1.id.toString(),
    })
    const order2 = makeOrder({
      deliverypersonId: deliveryperson.id.toString(),
      recipientId: recipient2.id.toString(),
    })

    await inMemoryDeliverypersonRepository.create(deliveryperson)
    await inMemoryRecipientRepository.create(recipient1)
    await inMemoryRecipientRepository.create(recipient2)
    await inMemoryOrderRepository.create(order1)
    await inMemoryOrderRepository.create(order2)

    const result = await sut.execute({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(1)
    expect(result.value).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          recipientId: recipient1.id.toString(),
          deliverypersonId: deliveryperson.id.toString(),
        }),
      ]),
    })
  })
})
