import { faker } from "@faker-js/faker";

export function randomUsername() {
  return faker.internet.username();
}

export function randomPassword() {
  return faker.internet.password();
}

export function randomEmail() {
  return faker.internet.email();
}

export function randomFirstName() {
  return faker.person.firstName();
}

export function randomLastName() {
  return faker.person.lastName();
}

export function randomOrganization() {
  return faker.company.name();
}

export function randomLocation() {
  return faker.location.city();
}

export function randomIrc() {
  return faker.internet.username();
}

export function generateUser() {
  return {
    login: randomUsername(),
    password: randomPassword(),
    email: randomEmail(),
    firstName: randomFirstName(),
    lastName: randomLastName(),
    organization: randomOrganization(),
    location: randomLocation(),
    irc: randomIrc(),
  };
}

export function randomNumbers(length: number) {
  return faker.string.numeric(length);
}

export function randomString(length: number) {
  return faker.string.alpha(length);
}

export function randomSymbols(length: number) {
  return faker.string.symbol(length);
}