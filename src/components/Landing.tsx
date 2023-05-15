import Head from "next/head";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Calendar,
  Check,
  FileText,
  LineChart,
  Menu,
  Plus,
  Smile,
  Sparkles,
  X,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Workflow", href: "#workflow" },
  { name: "Pricing", href: "#pricing" },
  { name: "GitHub", href: "https://github.com/muddle-co/muddle" },
];

const cases = [
  {
    name: "Stay ahead of the curve",
    description:
      "Muddle allows you to pen-test various API routes, recording any findings or vulnerabilities discovered. These functionalities give you the power to stay one step ahead, identifying potential weak points before they become problematic.",
    icon: LineChart,
  },
  {
    name: "Keep your policies current",
    description:
      "With Muddle, keeping your internal policies up-to-date is easier than ever. Schedule routine audits and record findings within the platform. No more missed updates or outdated procedures—Muddle keeps you in the know.",
    icon: FileText,
  },
  {
    name: "QA like never before",
    description:
      "Muddle offers continuous testing for application features, meaning you're always on top of your application's performance. Ensure your software is always delivering the highest quality user experience.",
    icon: Sparkles,
  },
];

const workflow = [
  {
    name: "Add your items",
    description:
      "Add everything to Muddle: your app features, API routes, internal policies, and more.",
    icon: Plus,
  },
  {
    name: "Choose how often to audit",
    description:
      "Select how frequently you would like to audit each item. Muddle will take it from there.",
    icon: Calendar,
  },
  {
    name: "Stay on top of your QA effortlessly",
    description:
      "Muddle schedules your audits for you and lets you know when to QA test your items.",
    icon: Smile,
  },
];

const includedFeatures = [
  "Audit applications, APIs, policies and more",
  "Record unlimited findings from your audits",
  "Collaborate and audit with your team",
  "Access to support, if you should need it",
];

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="text-white">
      <Head>
        <title>Muddle - Audit everything.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-900">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Muddle</span>
                <img className="h-8 w-auto" src="/logo.svg" alt="Muddle logo" />
              </Link>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <button
                onClick={() => signIn()}
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white"
              >
                Log in
              </button>
            </div>
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Muddle</span>
                  <img
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="Muddle logo"
                  />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/25">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <button
                      onClick={() => signIn()}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative isolate pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl tracking-tight text-white sm:text-6xl">
                  Audit everything.
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  In today&apos;s rapidly evolving digital landscape, meticulous
                  auditing is not just beneficial — it&apos;s vital. Muddle is
                  your key to maintaining top-tier quality and security across
                  all aspects of your operation.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <button
                    onClick={() => signIn()}
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => signIn()}
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Sign into your account
                  </button>
                </div>
              </div>
              <img
                src="/screenshot.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
              />
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-24 sm:py-32" id="about">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="mt-2 text-3xl tracking-tight text-white sm:text-4xl">
              The leading open-source continuous quality assurance &amp;
              auditing platform
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Muddle is a revolutionary application built for QA and continuous
              auditing. It&apos;s not just a tool, it&apos;s your reliable
              companion that ensures nothing falls through the cracks. With
              Muddle, you can set up schedules for auditing anything from
              policies and API routes to application features, and much more.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {cases.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <feature.icon
                      className="h-5 w-5 flex-none text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-gray-900 py-24 sm:py-32" id="workflow">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-white sm:text-4xl">
                  Supercharge your workflow
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Stop worrying about when and what to audit next; Muddle will
                  keep track of it all for you. Set up your auditing schedule
                  and Muddle does the rest, reminding you when it&apos;s time to
                  audit and helping you record your findings.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                  {workflow.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-white">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-500"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="block">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <img
              src="/screenshot.png"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-24 sm:py-32" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl tracking-tight text-gray-100 sm:text-4xl">
              One plan, everything included
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Muddle is straightforward software, and our pricing is
              no-different. That&apos;s why there&apos;s only one plan, and it
              includes everything.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-gray-800 bg-gray-700/20 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl tracking-tight text-gray-100">
                The &apos;everything&apos; plan
              </h3>
              <p className="mt-6 text-base leading-7 text-gray-400">
                We don&apos;t believe in charging you differently for different
                sets of features. That&apos;s why we&apos;ve made our pricing
                simple and straightforward. Best of all, you can try it free for
                14 days.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                  What&apos;s included
                </h4>
                <div className="h-px flex-auto bg-gray-700" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-400 sm:grid-cols-2 sm:gap-6"
              >
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-700/40 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-medium text-gray-400">
                    Billed monthly, per user
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl tracking-tight text-gray-100">
                      $8
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-400">
                      /mo
                    </span>
                  </p>
                  <button
                    onClick={() => signIn()}
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start my 14-day free trial
                  </button>
                  <p className="mt-6 text-xs leading-5 text-gray-500">
                    Card is charged automatically after trial ends. Cancel
                    anytime, in just a few clicks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav
            className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
            aria-label="Footer"
          >
            {navigation.map((item) => (
              <div key={item.name} className="pb-6">
                <a
                  href={item.href}
                  className="text-sm leading-6 text-gray-400 hover:text-gray-900"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; 2023 Muddle. Muddle is a trading name of GriffinCode Limited.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
