import { PrismaClient } from "@prisma/client";
import { User } from '@prisma/client';
import crypto from 'crypto';
import { DamoyeoError } from '.'

const prisma = new PrismaClient();

export class Sessions {
  /** 새로운 세션을 생성합니다. */
  public static async createSession(
    user: User,
  ): Promise<string> {
    const { userId } = user;

    const sessionId = await Sessions.generateSessionId();

    await prisma.session.create({
      data: { sessionId, user: { connect: { userId } } },
    });

    return sessionId;
  }

  public static async getSession(
    sessionId: string
  ): Promise<Sessions> {
    const session = await prisma.session
      .findFirst({ where: { sessionId } });

    return session;
  }

  /** 랜덤 세션 아이디를 생성합니다. */
  private static async generateSessionId(): Promise<string> {
    let sessionId;
    while (true) {
      sessionId = crypto.randomBytes(95).toString('base64');
      const session = await prisma.session.findFirst({
        where: { sessionId },
      });

      if (!session) break;
    }

    return sessionId;
  }
}
