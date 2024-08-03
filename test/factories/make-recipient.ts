import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zipCode: faker.location.zipCode(),
      ...override,
    },
    id,
  )

  return recipient
}
