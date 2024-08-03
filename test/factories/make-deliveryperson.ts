import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryperson,
  DeliverypersonProps,
} from '@/domain/delivery/enterprise/entities/deliveryperson'
import { UserRole } from '@/core/enums/UserRole'

export function makeDeliveryperson(
  override: Partial<DeliverypersonProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryperson = Deliveryperson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      role: UserRole.DELIVERYPERSON,
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return deliveryperson
}
