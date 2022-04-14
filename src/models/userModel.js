//참고 https://velog.io/@jinybear/TIL-6.-%EB%AA%A8%EB%93%88%ED%99%94%EC%99%80-MVC-%ED%8C%A8%ED%84%B4-2

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (user) => {
    try{
        const data = await prisma.user.create({
        data: user
        });
    return data;
    
    } catch(error){
        console.log(error);
    }
}

export const getUser = async (userId) => {
    try{
        const result = await prisma.user.findUnique({
            where:{
                userId: userId
            },
        });
        return result;
    
    } catch(error){
        console.log(error);
	}
}

export const deleteUser = async (userId) => {
    try{
        const result = await prisma.user.delete({
            where:{
                userId: userId
            },
        });
        return result;
    
    } catch(error){
        console.log(error);
	}
}

export const updateUser = async (userInfo, userId) => {
    try{
        const result = await prisma.user.update({
            where:{
                userId: userId
            },
            data: userInfo
        });
        return result;
    
    } catch(error){
        console.log(error);
	}
}

module.exports = {
  createUser,//회원가입
  getUser,//유저 정보 가져오기
  deleteUser,//회원정보 삭제
  updateUser,//회원정보 수정
}