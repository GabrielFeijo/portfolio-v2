export function calculateAge(birthDate: Date | string | number): number {
  const parsedDate = new Date(birthDate)

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid birth date provided to calculateAge.')
  }

  const now = new Date()

  if (parsedDate > now) {
    throw new Error('Birth date cannot be in the future.')
  }

  let age = now.getFullYear() - parsedDate.getFullYear()
  const monthDifference = now.getMonth() - parsedDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && now.getDate() < parsedDate.getDate())) {
    age--
  }

  return age
}
