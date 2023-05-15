import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Shell from "~/components/Shell";
import * as Popover from "@radix-ui/react-popover";
import * as Collapsible from "@radix-ui/react-collapsible";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { Users, ChevronRight, FolderPlus, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "~/components/EmptyState";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [projectName, setProjectName] = useState();
  const [projectTeam, setProjectTeam] = useState(null);

  const [teamName, setTeamName] = useState();

  const utils = api.useContext();

  const createProjectMutation = api.projects.createProject.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
    },
  });

  const handleProjectCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;

    if (!projectTeam) {
      setProjectTeam(teams[0]?.id);
    }

    try {
      await createProjectMutation.mutateAsync({
        team: projectTeam,
        name: projectName,
      });
      setProjectName(null);
      setProjectTeam(null);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const createTeamMutation = api.user.createTeam.useMutation({
    onSuccess: async () => {
      await utils.user.getTeams.invalidate();
      await utils.projects.getProjects.invalidate();
      await utils.projects.getAudits.invalidate();
    },
  });

  const handleTeamCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    try {
      await createTeamMutation.mutateAsync({
        name: teamName,
      });
      setTeamName(null);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const { data: teams } = api.user.getTeams.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const { data: projects } = api.projects.getProjects.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const { data: audits } = api.projects.getAudits.useQuery(
    { item: undefined }, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      <Shell title="Dashboard">
        {teams && teams.length === 0 && (
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg border border-gray-700 bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <Users className="mx-auto h-12 w-12 text-indigo-400" />
                    <div className="mt-4 text-center">
                      <h3 className="text-xl text-white" id="modal-title">
                        Create or join a team
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          All of your work happens in teams, so you can invite
                          others to collaborate easily. Create or join one to
                          get started.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <Collapsible.Root>
                      <Collapsible.Trigger className="w-full">
                        <button
                          type="button"
                          className="inline-flex max-h-10 w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                          Create a team
                        </button>
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <div className="mt-4 w-full rounded border border-gray-600 bg-gray-700 px-2 py-2 text-sm text-gray-200">
                          <form onSubmit={handleTeamCreate}>
                            <input
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                              type="text"
                              className="rounded-t border-t border-l border-r border-gray-600 bg-gray-800 px-4 py-2 w-full outline-none"
                              placeholder="Team name"
                            />
                            <button
                              type="submit"
                              className="rounded-b border border-gray-600 bg-indigo-800 text-white px-4 py-2 text-xs w-full font-medium"
                            >
                              Create
                            </button>
                          </form>
                        </div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                    <Collapsible.Root>
                      <Collapsible.Trigger className="w-full">
                        <button
                          type="button"
                          className="mt-3 inline-flex max-h-10 w-full justify-center rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                        >
                          Join a team
                        </button>
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <div className="mt-4 w-full rounded border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-gray-200">
                          A team owner must invite you by email.
                          <span className="mt-2 block text-xs text-gray-400">
                            If you&apos;ve been invited but aren&apos;t seeing
                            anything yet, refresh the page.
                          </span>
                        </div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="lg:pr-96">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-lg text-white">Projects</h1>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex text-xs text-indigo-400 hover:text-indigo-300">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Add project
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content>
                  <div className="mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                    <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                      <h3>Create a new project</h3>
                      <p className="text-xs text-gray-500">
                        Add a new project to collect items
                      </p>
                    </div>
                    <form onSubmit={handleProjectCreate}>
                      <select
                        className="mr-2 bg-gray-800 px-4 py-2 outline-none"
                        onChange={(e) => {
                          setProjectTeam(e.target.value);
                        }}
                      >
                        {teams &&
                          teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                      <input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        type="text"
                        className="border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
                        placeholder="Project name"
                      />
                      <button
                        type="submit"
                        className="border-l border-gray-600 px-4 text-xs font-medium"
                      >
                        Create
                      </button>
                    </form>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </header>

          <div className="mx-8 mt-8">
            {projects && projects.length === 0 && (
              <EmptyState
                icon={FolderPlus}
                heading="You don't have any projects"
                description="Create a new one to get started."
              />
            )}
            <ul
              role="list"
              className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              {projects &&
                projects.map((project) => (
                  <li
                    key={project.name}
                    className="col-span-1 flex rounded-md shadow-sm"
                  >
                    <div
                      className={classNames(
                        project.bgColor,
                        "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md border-b border-l border-t border-gray-700 text-sm font-medium text-white"
                      )}
                    >
                      {project.name.substring(0, 3)}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-700 bg-gray-800">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <Link
                          href={"/projects/" + project.id}
                          className="font-medium text-gray-200 hover:text-gray-300"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          Created {dayjs(project.createdAt).fromNow()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={"/projects/" + project.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <span className="sr-only">Open options</span>
                          <ChevronRight
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </main>

        {/* Activity feed */}
        <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="text-lg text-white">Activity feed</h2>
          </header>
          {audits && audits.length === 0 && (
            <div className="my-8">
              <EmptyState
                icon={Pencil}
                heading="You haven't performed any audits"
                description="Record an audit and it will show up here."
              />
            </div>
          )}
          <ul role="list" className="divide-y divide-white/5">
            {audits &&
              audits.map((audit) => (
                <li key={audit.id} className="px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={audit.user?.image || "/logo.svg"}
                      alt=""
                      className="h-6 w-6 flex-none rounded-full bg-indigo-800"
                    />
                    <p className="flex-auto truncate text-sm font-semibold leading-6 text-white">
                      {audit.user?.name}
                    </p>
                    <time className="flex-none text-xs text-gray-600">
                      {dayjs(audit.createdAt).format("ddd D MMM, YYYY")}
                    </time>
                  </div>
                  <p className="mt-3 truncate text-sm text-gray-500">
                    Audited{" "}
                    <span className="text-gray-400">{audit.item?.name}</span>{" "}
                    and it{" "}
                    <span className="text-gray-400">{audit.status}ed</span> with{" "}
                    <span className="text-gray-400">
                      {audit.findings?.length} findings
                    </span>
                  </p>
                </li>
              ))}
          </ul>
        </aside>
      </Shell>
    </>
  );
};

export default Home;
