import { Fragment, useState } from "react";
import Head from "next/head";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, Calendar, Copy, Folder, Users, X, Cog } from "lucide-react";
import Link from "next/link";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Landing from "./Landing";

const navigation = [
  { name: "Projects", href: "/", icon: Folder },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Cog },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Shell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: projects } = api.projects.getProjects.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  if (!sessionData?.user) {
    return <Landing />;
  }

  return (
    <>
      <Head>
        <title>{title} | Muddle</title>
        <meta name="description" content="Audit everything." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/logo.svg"
                        alt="Muddle"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    router.asPath === item.href
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <item.icon
                                    className="h-5 w-5 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your projects
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {projects &&
                              projects.map((project) => (
                                <li key={project.id}>
                                  <Link
                                    href={"/projects/" + project.id}
                                    className={classNames(
                                      router.asPath ===
                                        "/projects/" + project.id
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                      {project.name.substring(0, 2)}
                                    </span>
                                    <span className="truncate">
                                      {project.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden border-r border-white/5 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img className="h-8 w-auto pt-2" src="/logo.svg" alt="Muddle" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            router.asPath === item.href
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            className="mt-0.5 h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  {projects && projects.length > 0 && (
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Your projects
                    </div>
                  )}
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {projects &&
                      projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={"/projects/" + project.id}
                            className={classNames(
                              // Link this up to something
                              router.asPath === "/projects/" + project.id
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                              {project.name.substring(0, 2)}
                            </span>
                            <span className="truncate">{project.name}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-indigo-800"
                      src={sessionData.user?.image || "/logo.svg"}
                      alt={sessionData.user?.name || "Unknown"}
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {sessionData.user?.name || "Unknown"}
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div>
          <button onClick={() => signOut()}>
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-800"
              src={sessionData.user?.image}
              alt={sessionData.user?.name || "Unknown"}
            />
          </button>
        </div>

        <main className="h-screen bg-gray-900 text-white lg:pl-72">
          {children}
        </main>
      </div>
    </>
  );
}
