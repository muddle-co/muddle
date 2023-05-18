<p align="center">
  <a href="https://muddle.co">
   <img src="https://muddle.co/screenshot.png" alt="Product screenshot">
  </a>

  <h3 align="center">Muddle</h3>

  <p align="center">
    Audit everything.
    <br />
    <a href="https://muddle.co"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://muddle.co">Website</a>
    ·
    <a href="https://github.com/muddle-co/muddle/issues">Issues</a>
    ·
    <a href="https://github.com/muddle-co/muddle/pulls">Pull Requests</a>
  </p>
</p>

# The leading open-source continuous quality assurance & auditing platform

In today's rapidly evolving digital landscape, meticulous auditing is not just beneficial — it's vital. Muddle is your key to maintaining top-tier quality and security across all aspects of your operation.

Muddle is a revolutionary application built for QA and continuous auditing. It's not just a tool, it's your reliable companion that ensures nothing falls through the cracks. With Muddle, you can set up schedules for auditing anything from policies and API routes to application features, and much more.

## Stay ahead of the curve
Muddle allows you to pen-test various API routes, recording any findings or vulnerabilities discovered. These functionalities give you the power to stay one step ahead, identifying potential weak points before they become problematic.

## Keep your policies current
With Muddle, keeping your internal policies up-to-date is easier than ever. Schedule routine audits and record findings within the platform. No more missed updates or outdated procedures—Muddle keeps you in the know.

## QA like never before
Muddle offers continuous testing for application features, meaning you're always on top of your application's performance. Ensure your software is always delivering the highest quality user experience.

# Supercharge your workflow
Stop worrying about when and what to audit next; Muddle will keep track of it all for you. Set up your auditing schedule and Muddle does the rest, reminding you when it's time to audit and helping you record your findings.

# Built With

- [Next.js](https://nextjs.org)
- [React](https://reactjs.org)
- [tRPC](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io)

# Getting Started

To get a local copy up and running, please follow these simple steps.

## Prerequisites

Here is what you need to be able to run Muddle.

- Node.js (Version: >=15.x <17)
- PostgreSQL
- Yarn _(recommended)_

> You will also need to register an app with Google in order to enable Google SSO.

## Development
1. Clone the repo into a public GitHub repository (or fork https://github.com/muddle-co/muddle/fork). If you plan to distribute the code, keep the source code public to comply with [AGPLv3](https://github.com/muddle-co/muddle/blob/main/LICENSE).

   ```sh
   git clone https://github.com/muddle-co/muddle.git
   ```
1. Go to the project folder

   ```sh
   cd muddle
   ```
1. Install packages with pnpm

   ```sh
   pnpm install
   ```
1. Set up your `.env` file
   - Duplicate `.env.example` to `.env`
   - Set the `DATABASE_URL` to a PostgreSQL connection string.
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Fill in any other relevant values
1. Run with `pnpm run dev`

## Upgrade
1. Pull the current version:

   ```sh
   git pull
   ```
1. Check if dependencies got added/updated/removed

   ```sh
   pnpm install
   ```
1. Apply database migrations by running <b>one of</b> the following commands:

   In a development environment, run:

   ```sh
   pnpm prisma db push
   ```

   (This can clear your development database in some cases)
1. Check for `.env` variables changes
1. Start the server. In a development environment, just do:

   ```sh
   pnpm run dev
   ```

   For a production build, run for example:

   ```sh
   pnpm run build
   pnpm run start
   ```
1. Enjoy the new version.
<!-- DEPLOYMENT -->

# Contributing

Please see our [contributing guide](/CONTRIBUTING.md).

# License

Distributed under the [GPLv3 License](https://github.com/muddle-co/muddle/blob/main/LICENSE). See `LICENSE` for more information.
