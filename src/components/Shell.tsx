import { Fragment, useState } from "react";
import Head from "next/head";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, Folder, Users, X, Cog } from "lucide-react";
import Link from "next/link";
import { api } from "~/utils/api";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Landing from "./Landing";

const navigation = [
  { name: "Projects", href: "/", icon: Folder },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Cog },
];

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ShellProps {
  title: string;
  children: React.ReactNode;
}

export default function Shell({ title, children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  const { data: projects } = api.projects.getProjects.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  if (!sessionData?.user && status === "loading") {
    return (
      <div className="h-screen w-full bg-gray-900">
        <div role="status" className="flex h-full">
          <svg
            aria-hidden="true"
            className="h-16 w-16 animate-spin fill-indigo-600 text-gray-700 self-center mx-auto"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!sessionData?.user && status !== "loading") {
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
                      src={sessionData?.user?.image || "/logo.svg"}
                      alt={sessionData?.user?.name || "Unknown"}
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {sessionData?.user?.name || "Unknown"}
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
              src={sessionData?.user?.image || "/logo.svg"}
              alt={sessionData?.user?.name || "Unknown"}
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
