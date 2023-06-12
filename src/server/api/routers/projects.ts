import { z } from "zod";
import { prisma } from "~/server/db";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getProjects: protectedProcedure.query(({ ctx }) => {
    return prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      },
    });
  }),
  createProject: protectedProcedure
    .input(z.object({ team: z.string(), name: z.string() }))
    .mutation(({ input }) => {
      return prisma.project.create({
        data: {
          name: input.name,
          team: {
            connect: {
              id: input.team,
            },
          },
        },
      });
    }),
  getItems: protectedProcedure
    .input(z.object({ project: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (input) {
        return prisma.item.findMany({
          where: {
            projectId: input.project,
            project: {
              team: {
                members: {
                  some: {
                    id: ctx.session.user.id,
                  },
                },
              },
            },
          },
          include: {
            audits: {
              include: {
                user: true,
                findings: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
      } else {
        return prisma.item.findMany();
      }
    }),
  getItem: protectedProcedure
    .input(z.object({ item: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.item.findFirst({
        where: {
          id: input.item,
          project: {
            team: {
              members: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
        include: {
          audits: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    }),
  createItem: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        name: z.string(),
        frequency: z.object({ value: z.number(), unit: z.string() }).optional(),
      })
    )
    .mutation(({ input }) => {
      return prisma.item.create({
        data: {
          name: input.name,
          frequency: input.frequency || {},
          project: {
            connect: {
              id: input.project,
            },
          },
        },
      });
    }),
  modifyItem: protectedProcedure
    .input(
      z.object({
        item: z.string(),
        project: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        frequency: z.object({ value: z.number(), unit: z.string() }).optional(),
      })
    )
    .mutation(({ input }) => {
      return prisma.item.update({
        where: {
          id: input.item,
        },
        data: {
          name: input.name,
          description: input.description,
          frequency: input.frequency,
          project: {
            connect: {
              id: input.project,
            },
          },
        },
      });
    }),
  deleteItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.item.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAudits: protectedProcedure
    .input(z.object({ item: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (input) {
        return prisma.audit.findMany({
          where: {
            itemId: input.item,
            item: {
              project: {
                team: {
                  members: {
                    some: {
                      id: ctx.session.user.id,
                    },
                  },
                },
              },
            },
          },
          include: {
            user: true,
            item: true,
            findings: true,
          },
        });
      } else {
        return prisma.audit.findMany({
          where: {
            item: {
              project: {
                team: {
                  members: {
                    some: {
                      id: ctx.session.user.id,
                    },
                  },
                },
              },
            },
          },
          include: {
            user: true,
            item: true,
            findings: true,
          },
        });
      }
    }),
  createAudit: protectedProcedure
    .input(
      z.object({
        item: z.string(),
        status: z.string(),
        date: z.string().optional(),
        notes: z.string().optional(),
        user: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.audit.create({
        data: {
          status: input.status,
          notes: input.notes,
          createdAt: input.date || new Date(),
          item: {
            connect: {
              id: input.item,
            },
          },
          user: {
            connect: {
              id: input.user,
            },
          },
        },
      });
    }),
  deleteAudit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.audit.delete({
        where: {
          id: input.id,
        },
      });
    }),
  createFinding: protectedProcedure
    .input(
      z.object({
        audit: z.string(),
        severity: z.string(),
        notes: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.finding.create({
        data: {
          severity: input.severity,
          notes: input.notes,
          audit: {
            connect: {
              id: input.audit,
            },
          },
        },
      });
    }),
});
