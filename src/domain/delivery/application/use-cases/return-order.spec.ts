import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { ReturnOrderUseCase } from './return-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryperson } from 'test/factories/make-deliveryperson'
import { InMemoryDeliverypersonRepository } from 'test/repositories/in-memory-deliveryperson-repository'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliverypersonRepository: InMemoryDeliverypersonRepository

let sut: ReturnOrderUseCase

describe('Return Order', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliverypersonRepository = new InMemoryDeliverypersonRepository()

    sut = new ReturnOrderUseCase(
      inMemoryOrderRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to return order', async () => {
    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const deliveryperson = makeDeliveryperson()
    await inMemoryDeliverypersonRepository.create(deliveryperson)

    const order = makeOrder({
      deliverypersonId: deliveryperson.id.toString(),
    })
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliverypersonId: deliveryperson.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      status: 'returned',
    })
  })
})
