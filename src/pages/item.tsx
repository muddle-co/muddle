import { type NextPage } from "next";
import { Menu, Transition } from "@headlessui/react";
import Shell from "~/components/Shell";
import { Fragment } from "react";
import { ChevronRight, ChevronsUpDown } from "lucide-react";

const secondaryNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Activity", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
  { name: "Collaborators", href: "#", current: false },
  { name: "Notifications", href: "#", current: false },
];
const stats = [
  { name: "Number of deploys", value: "405" },
  { name: "Average deploy time", value: "3.65", unit: "mins" },
  { name: "Number of servers", value: "3" },
  { name: "Success rate", value: "98.5%" },
];
const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "2d89f0c8",
    branch: "main",
    status: "Completed",
    duration: "25s",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Item: NextPage = () => {
  return (
    <>
      <Shell title="Item">
        <main>
          <header>
            {/* Secondary navigation */}
            <nav className="flex overflow-x-auto border-b border-white/10 py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
              >
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={item.current ? "text-indigo-400" : ""}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Heading */}
            <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <p className="flex gap-x-3 text-base leading-7">
                    <span className="font-semibold text-white">Planetaria</span>
                    <span className="text-gray-600">/</span>
                    <span className="font-semibold text-white">mobile-api</span>
                  </p>
                </div>
                <p className="mt-2 text-xs leading-6 text-gray-400">
                  Deploys from GitHub via main branch
                </p>
              </div>
              <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                Production
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, statIdx) => (
                <div
                  key={stat.name}
                  className={classNames(
                    statIdx % 2 === 1
                      ? "sm:border-l"
                      : statIdx === 2
                      ? "lg:border-l"
                      : "",
                    "border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"
                  )}
                >
                  <p className="text-sm font-medium leading-6 text-gray-400">
                    {stat.name}
                  </p>
                  <h2 className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl tracking-tight text-white">
                      {stat.value}
                    </span>
                    {stat.unit ? (
                      <span className="text-sm text-gray-400">{stat.unit}</span>
                    ) : null}
                  </h2>
                </div>
              ))}
            </div>
          </header>

          {/* Activity list */}
          <div className="border-t border-white/10 pt-11">
            <h2 className="px-4 text-lg text-white sm:px-6 lg:px-8">
              Latest activity
            </h2>
            <table className="mt-6 w-full whitespace-nowrap text-left">
              <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
              </colgroup>
              <thead className="border-b border-white/10 text-sm leading-6 text-white">
                <tr>
                  <th
                    scope="col"
                    className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                  >
                    Commit
                  </th>
                  <th
                    scope="col"
                    className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                  >
                    Deployed at
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activityItems.map((item) => (
                  <tr key={item.commit}>
                    <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                      <div className="flex items-center gap-x-4">
                        <img
                          src={item.user.imageUrl}
                          alt=""
                          className="h-8 w-8 rounded-full bg-gray-800"
                        />
                        <div className="truncate text-sm font-medium leading-6 text-white">
                          {item.user.name}
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                      <div className="flex gap-x-3">
                        <div className="font-mono text-sm leading-6 text-gray-400">
                          {item.commit}
                        </div>
                        <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                          {item.branch}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                      <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                        <time
                          className="text-gray-400 sm:hidden"
                          dateTime={item.dateTime}
                        >
                          {item.date}
                        </time>
                        <div
                          className={classNames(
                            statuses[item.status],
                            "flex-none rounded-full p-1"
                          )}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <div className="hidden text-white sm:block">
                          {item.status}
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                      {item.duration}
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      <time dateTime={item.dateTime}>{item.date}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </Shell>
    </>
  );
};

export default Item;
