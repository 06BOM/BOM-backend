//참고 https://velog.io/@jinybear/TIL-6.-%EB%AA%A8%EB%93%88%ED%99%94%EC%99%80-MVC-%ED%8C%A8%ED%84%B4-2

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createUser = (fields) => {
  const data = makeDataForCreate(fields)
  return prisma.users.create({ data })
}

const findUser = (field) => {
  const [uniqueKey] = Object.keys(field)

  const isKeyId = uniqueKey === 'id'
  const value = isKeyId ? Number(field[uniqueKey]) : field[uniqueKey]

  return prisma.users.findOne({ where: { [uniqueKey]: value } })
}

module.exports = {
  createUser,//회원가입
  findUser,//user 정보 가져오기
}