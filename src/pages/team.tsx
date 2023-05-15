import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Shell from "~/components/Shell";
import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { ChevronRight, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "~/components/EmptyState";

const Team: NextPage = () => {
  const { data: sessionData } = useSession();
  const [userEmail, setUserEmail] = useState();

  const utils = api.useContext();

  const addUserToTeamMutation = api.user.addUserToTeam.useMutation({
    onSuccess: async () => {
      await utils.user.getUsers.invalidate();
    },
  });

  const handleAddUserToTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    try {
      await addUserToTeamMutation.mutateAsync({
        user: userEmail,
      });
      setUserEmail(null);
    } catch (error) {
      console.error("Error adding user to team:", error);
    }
  };

  const { data: users } = api.user.getUsers.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      <Shell title="Team">
        <main>
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-lg text-white">Team</h1>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex text-xs text-indigo-400 hover:text-indigo-300">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Add someone
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content>
                  <div className="mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                    <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                      <h3>Invite to your team</h3>
                      <p className="text-xs text-gray-500">
                        Invite a user to your team
                      </p>
                    </div>
                    <form onSubmit={handleAddUserToTeam}>
                      <input
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        type="text"
                        className="border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
                        placeholder="Email address to invite"
                      />
                      <button
                        type="submit"
                        className="border-l border-gray-600 px-4 text-xs font-medium"
                      >
                        Invite
                      </button>
                    </form>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </header>

          <div className="mx-8 mt-8">
            {users && users.length === 0 && (
              <EmptyState
                icon={UserPlus}
                heading="You're not joined to a team"
                description="Create or join a team to collaborate with others."
              />
            )}
            <ul
              role="list"
              className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            >
              {users &&
                users.map((user) => (
                  <li
                    key={user.id}
                    className="col-span-1 flex rounded-md shadow-sm"
                  >
                    <img
                      src={user.image}
                      className="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md border-b border-l border-t border-gray-700 text-sm font-medium text-white"
                    />
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-700 bg-gray-800">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <Link
                          href={"/user/" + user.id}
                          className="font-medium text-gray-200 hover:text-gray-300"
                        >
                          {user.name}
                        </Link>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={"/user/" + user.id}
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
      </Shell>
    </>
  );
};

export default Team;
