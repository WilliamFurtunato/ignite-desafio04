import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchDeliverypersonOrdersUseCase } from './fetch-deliveryperson-orders'
import { makeOrder } from 'test/factories/make-order'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository
let inMemoryOrderRepository: InMemoryOrderRepository

let sut: FetchDeliverypersonOrdersUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()

    sut = new FetchDeliverypersonOrdersUseCase(
      inMemoryOrderRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to fetch orders', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    const order1 = makeOrder({
      deliverypersonId: deliveryperson.id.toString(),
    })
    await inMemoryOrderRepository.create(order1)

    const order2 = makeOrder({
      deliverypersonId: deliveryperson.id.toString(),
    })
    await inMemoryOrderRepository.create(order2)

    const order3 = makeOrder({
      deliverypersonId: 'other',
    })
    await inMemoryOrderRepository.create(order3)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliverypersonId: deliveryperson.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders).toHaveLength(2)
  })
})
