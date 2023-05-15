import { z } from "zod";
import { prisma } from "~/server/db";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getTeams: protectedProcedure.query(({ ctx }) => {
    return prisma.team.findMany({
      where: {
        members: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.team.create({
        data: {
          name: input.name,
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  addUserToTeam: protectedProcedure
    .input(
      z.object({
        user: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await prisma.team.findFirst({
        where: {
          members: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      if (!team) {
        throw new Error("User is not in a team");
      }
      return prisma.user.update({
        where: {
          email: input.user,
        },
        data: {
          team: {
            connect: {
              id: team.id,
            },
          },
        },
      });
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    // Find team by ctx userId and return all users in that team
    const team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
    if (!team) {
      return [];
    }
    return prisma.user.findMany({
      where: {
        team: {
          id: team.id,
        },
      },
    });
  }),
  modifyUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    }),
});
