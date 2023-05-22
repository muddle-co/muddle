import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import * as Popover from "@radix-ui/react-popover";
import Shell from "~/components/Shell";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import {
  ChevronDown,
  ChevronRight,
  ListPlus,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/router";

const statuses = {
  inactive: "text-gray-500 bg-gray-100/10",
  pass: "text-green-400 bg-green-400/10",
  fail: "text-rose-400 bg-rose-400/10",
  info: "text-blue-400 bg-blue-400/10",
  low: "text-yellow-400 bg-yellow-400/10",
  medium: "text-orange-400 bg-orange-400/10",
  high: "text-red-400 bg-red-400/10",
};

const results = {
  inactive: "text-gray-300 bg-gray-100/10 ring-gray-400/20",
  pass: "text-green-400 bg-green-400/10 ring-green-400/20",
  fail: "text-rose-400 bg-rose-400/10 ring-rose-400/30",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Project: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const [selectedItem, setSelectedItem] = useState();

  const [itemName, setItemName] = useState();
  const [itemFrequencyUnit, setItemFrequencyUnit] = useState("day");
  const [itemFrequencyValue, setItemFrequencyValue] = useState(0);

  const [auditDate, setAuditDate] = useState();
  const [auditStatus, setAuditStatus] = useState("pass");
  const [auditNotes, setAuditNotes] = useState();

  const [selectedAudit, setSelectedAudit] = useState();
  const [findingSeverity, setFindingSeverity] = useState("info");
  const [findingNotes, setFindingNotes] = useState();

  const { data: projects } = api.projects.getProjects.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const { data: items } = api.projects.getItems.useQuery(
    { project: router.query.project?.toString() },
    { enabled: sessionData?.user !== undefined }
  );

  const utils = api.useContext();

  const createItemMutation = api.projects.createItem.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const modifyItemMutation = api.projects.modifyItem.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const deleteItemMutation = api.projects.deleteItem.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const handleItemCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    try {
      await createItemMutation.mutateAsync({
        project: router.query.project?.toString(),
        name: itemName,
      });
      setItemName(null);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleItemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName) setItemName("");

    try {
      if (itemFrequencyValue === 0) {
        await modifyItemMutation.mutateAsync({
          item: selectedItem.id,
          project: router.query.project?.toString(),
          name: itemName,
        });
      } else {
        await modifyItemMutation.mutateAsync({
          item: selectedItem.id,
          project: router.query.project?.toString(),
          name: itemName,
          frequency: {
            unit: itemFrequencyUnit,
            value: parseInt(itemFrequencyValue),
          },
        });
      }
      setItemName();
      setItemFrequencyUnit("day");
      setItemFrequencyValue(0);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleItemDelete = async () => {
    try {
      await deleteItemMutation.mutateAsync({
        id: selectedItem?.id,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const createAuditMutation = api.projects.createAudit.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const deleteAuditMutation = api.projects.deleteAudit.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const handleAuditCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createAuditMutation.mutateAsync({
        item: selectedItem.id,
        date: dayjs(auditDate).toISOString(),
        status: auditStatus,
        notes: auditNotes,
        user: sessionData?.user?.id,
      });
      setAuditDate();
      setAuditStatus("pass");
      setAuditNotes();
    } catch (error) {
      console.error("Error creating audit:", error);
    }
  };

  const handleAuditDelete = async (auditId: string) => {
    try {
      await deleteAuditMutation.mutateAsync({
        id: auditId,
      });
    } catch (error) {
      console.error("Error deleting audit:", error);
    }
  };

  const createFindingMutation = api.projects.createFinding.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjects.invalidate();
      await utils.projects.getItems.invalidate();
    },
  });

  const handleFindingCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createFindingMutation.mutateAsync({
        audit: selectedAudit || "",
        severity: findingSeverity,
        notes: findingNotes || "",
      });
      setFindingSeverity("info");
      setFindingNotes("");
    } catch (error) {
      console.error("Error creating finding:", error);
    }
  };

  // Update selectedItem to a fresh version whenever the content of items changes
  useEffect(() => {
    if (selectedItem) {
      setSelectedItem(
        items?.find((item) => item.id === selectedItem.id) || null
      );
    }
  }, [items]);

  const stats = [
    {
      name: "Pass rate",
      value:
        selectedItem?.audits?.length === 0
          ? "0%"
          : Math.round(
              (selectedItem?.audits.filter((audit) => audit.status === "pass")
                .length /
                selectedItem?.audits.length) *
                100
            ) + "%",
    },
    { name: "Audits performed", value: selectedItem?.audits.length || 0 },
    {
      name: "Number of findings",
      value: (selectedItem?.audits || []).reduce(
        (count, audit) => count + audit.findings.length,
        0
      ),
    },
    {
      name: "Failures",
      value:
        selectedItem?.audits.filter((audit) => audit.status === "fail")
          .length || 0,
    },
  ];

  return (
    <>
      <Shell
        title={
          selectedItem
            ? selectedItem?.name
            : projects?.find((project) => project.id === router.query.project)
                ?.name
        }
      >
        <main className={selectedItem && "lg:pr-[800px]"}>
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-lg text-white">
              {
                projects?.find((project) => project.id === router.query.project)
                  ?.name
              }
            </h1>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex text-xs text-indigo-400 hover:text-indigo-300">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Add item
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content>
                  <div className="mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                    <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                      <h3>Create a new item</h3>
                      <p className="text-xs text-gray-500">
                        Add a new item to audit
                      </p>
                    </div>
                    <form onSubmit={handleItemCreate}>
                      <input
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        type="text"
                        className="bg-gray-800 px-4 py-2 outline-none"
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

          {/* Item list */}
          {items && items.length === 0 && (
            <div className="mt-8 flex items-center justify-center lg:mt-24">
              <ListPlus
                className="mr-4 mt-0.5 h-12 w-12 text-white/50"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg text-white">No items found</h2>
                <p className="text-xs text-gray-500">
                  Add a new item to get started
                </p>
              </div>
            </div>
          )}
          <ul role="list" className="divide-y divide-white/5">
            {items &&
              items.map((item) => (
                <li
                  key={item.id}
                  className={classNames(
                    selectedItem?.id === item.id && "bg-gray-800/40",
                    "relative flex items-center space-x-4 px-4 py-4 hover:bg-gray-800/20 sm:px-6 lg:px-8"
                  )}
                >
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                      <div
                        className={classNames(
                          statuses[item.audits[0]?.status] || statuses.inactive,
                          "flex-none rounded-full p-1"
                        )}
                      >
                        <div className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <p className="min-w-0 text-sm font-semibold leading-6 text-white truncate">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="flex gap-x-2"
                        >
                          <span className="truncate">
                            {
                              projects?.find(
                                (project) => project.id === router.query.project
                              )?.name
                            }
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className="whitespace-nowrap">{item.name}</span>
                          <span className="absolute inset-0" />
                        </button>
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                      <p className="truncate">{item.audits?.length} audits</p>
                      <svg
                        viewBox="0 0 2 2"
                        className="h-0.5 w-0.5 flex-none fill-gray-300"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="whitespace-nowrap">
                        {item?.frequency &&
                        item.frequency.value &&
                        item.frequency.unit
                          ? `Due ${dayjs(item?.audits[0]?.createdAt)
                              .add(item.frequency.value, item.frequency.unit)
                              .fromNow()}`
                          : "No due date"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      results[item.audits[0]?.status] || results.inactive,
                      "flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {item.audits[0]?.status.toUpperCase() || "NO AUDITS"}
                  </div>
                  <ChevronRight
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </li>
              ))}
          </ul>
        </main>

        {selectedItem && (
          <aside className="bg-black/10 animate-in slide-in-from-right lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:w-[800px] lg:overflow-y-auto lg:border-l lg:border-white/5">
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <h2 className="text-lg text-white">{selectedItem.name}</h2>
              <div className="space-x-4">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button>
                      <Pencil
                        className="mb-0.5 h-5 w-5 text-gray-400 hover:text-gray-200"
                        aria-hidden="true"
                      />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content>
                      <div className="mr-6 mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                        <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                          <h3>Edit the name of this item</h3>
                          <p className="text-xs text-gray-500">
                            Change the name of this existing item
                          </p>
                        </div>
                        <form onSubmit={handleItemUpdate}>
                          <input
                            defaultValue={selectedItem?.name}
                            onChange={(e) => setItemName(e.target.value)}
                            type="text"
                            className="bg-gray-800 px-4 py-2 outline-none"
                          />
                          <button
                            type="submit"
                            className="border-l border-gray-600 px-4 text-xs font-medium"
                          >
                            Update
                          </button>
                        </form>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
                <button onClick={() => handleItemDelete(selectedItem?.id)}>
                  <Trash
                    className="mb-0.5 h-5 w-5 text-gray-400 hover:text-rose-400"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={() => setSelectedItem(null)}>
                  <X
                    className="h-6 w-6 text-gray-400 hover:text-gray-200"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </header>

            {/* Heading */}
            <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <div
                    className={classNames(
                      statuses[selectedItem.audits[0]?.status] ||
                        statuses.inactive,
                      "flex-none rounded-full p-1"
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h1 className="flex gap-x-3 text-base leading-7">
                    <span className="font-semibold text-white">
                      {selectedItem.frequency?.value &&
                      selectedItem.frequency?.unit
                        ? "Due " +
                          dayjs(selectedItem?.audits[0]?.createdAt)
                            .add(
                              selectedItem?.frequency?.value,
                              selectedItem?.frequency?.unit
                            )
                            .fromNow()
                        : "No schedule set"}
                    </span>
                  </h1>
                </div>
                <p className="mt-1 text-xs leading-6 text-gray-400">
                  {selectedItem.frequency.value && selectedItem.frequency.unit
                    ? `Set to be checked every ${selectedItem.frequency.value} ${selectedItem.frequency.unit}s`
                    : "You can set up a schedule to be reminded when this item is due for an audit."}
                </p>
              </div>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex text-xs text-indigo-400 hover:text-indigo-300">
                    <ChevronDown className="mr-1 h-4 w-4" aria-hidden="true" />
                    Change schedule
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content>
                    <div className="mr-6 mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                      <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                        <h3>Modify schedule</h3>
                        <p className="text-xs text-gray-500">
                          Change the audit frequency for this item.
                        </p>
                      </div>
                      <form onSubmit={handleItemUpdate}>
                        <input
                          value={itemFrequencyValue || ""}
                          onChange={(e) =>
                            setItemFrequencyValue(e.target.value)
                          }
                          type="number"
                          min={0}
                          className="bg-gray-800 px-4 py-2 outline-none"
                        />
                        <select
                          value={itemFrequencyUnit || "day"}
                          onChange={(e) => setItemFrequencyUnit(e.target.value)}
                          className="mr-2 bg-gray-800 px-4 py-2 outline-none"
                        >
                          <option value="day">Days</option>
                          <option value="week">Weeks</option>
                          <option value="month">Months</option>
                          <option value="year">Years</option>
                        </select>
                        <button
                          type="submit"
                          className="border-l border-gray-600 px-4 text-xs font-medium"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
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
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <h3 className="text-4xl tracking-tight text-white">
                      {stat.value}
                    </h3>
                    {stat.unit ? (
                      <span className="text-sm text-gray-400">{stat.unit}</span>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>

            {/* Activity list */}
            <div className="border-t border-white/10 pt-11">
              <div className="flex">
                <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
                  Latest activity
                </h2>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="ml-auto mr-8 mt-1 flex text-xs text-indigo-400 hover:text-indigo-300">
                      <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                      Add an audit
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content>
                      <div className="mr-6 mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                        <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                          <h3>Record a new audit</h3>
                          <p className="text-xs text-gray-500">
                            Create a new record of an audit.
                          </p>
                        </div>
                        <form onSubmit={handleAuditCreate}>
                          <input
                            value={auditDate}
                            onChange={(e) => setAuditDate(e.target.value)}
                            type="date"
                            className="bg-gray-800 px-4 py-2 outline-none"
                          />
                          <select
                            value={auditStatus}
                            onChange={(e) => setAuditStatus(e.target.value)}
                            className="mr-2 border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
                          >
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                          </select>
                          <input
                            value={auditNotes}
                            onChange={(e) => setAuditNotes(e.target.value)}
                            type="text"
                            placeholder="Notes"
                            className="border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
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
              </div>
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
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Date
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
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      <span className="hidden">Findings</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedItem.audits?.length === 0 && (
                    <tr>
                      <td
                        className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8"
                        colSpan={5}
                      >
                        <div className="text-center text-sm font-medium text-gray-500">
                          No audits yet
                        </div>
                      </td>
                    </tr>
                  )}
                  {selectedItem?.audits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="py-4 pl-4 sm:pl-6 lg:pl-8">
                        <div className="flex items-center gap-x-4">
                          <img
                            src={audit.user?.image || "/logo.svg"}
                            alt=""
                            className="h-8 w-8 rounded-full bg-indigo-800"
                          />
                          <div className="text-sm font-medium leading-6 text-white">
                            {audit.user?.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pl-4 sm:pl-6 lg:pl-8">
                        <div className="gap-x-4">
                          <div className="truncate text-sm font-medium leading-6 text-white">
                            {dayjs(audit.createdAt).format("MMM D, YYYY")}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pl-0 pr-4 text-sm leading-6">
                        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                          <div
                            className={classNames(
                              statuses[audit.status] || statuses.inactive,
                              "flex-none rounded-full p-1"
                            )}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                          </div>
                          <div className="hidden text-white sm:block">
                            {audit.status.toUpperCase() || "Inactive"}
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-4">
                        {audit.notes}
                        {audit.findings?.length > 0 && (
                          <ul className="mt-1">
                            {audit.findings.map((finding) => (
                              <li
                                key={finding.id}
                                className="flex items-center gap-x-2"
                              >
                                <div
                                  className={classNames(
                                    statuses[finding.severity] ||
                                      statuses.inactive,
                                    "flex-none rounded-full p-1"
                                  )}
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                </div>
                                <div className="text-xs font-medium leading-4 text-gray-500">
                                  {finding.notes}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="hidden space-y-2 py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                        <Popover.Root>
                          <Popover.Trigger asChild>
                            <button onClick={() => setSelectedAudit(audit.id)} className="ml-auto mt-1 flex text-xs text-indigo-400 hover:text-indigo-300">
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </Popover.Trigger>
                          <Popover.Portal>
                            <Popover.Content>
                              <div className="mr-6 mt-2 rounded-sm border border-gray-700 bg-gray-800 text-sm text-white animate-in fade-in slide-in-from-top">
                                <div className="border-b border-gray-600 bg-gray-800 px-4 py-2">
                                  <h3>Record a new finding</h3>
                                  <p className="text-xs text-gray-500">
                                    Create a new finding for this audit.
                                  </p>
                                </div>
                                <form onSubmit={handleFindingCreate}>
                                  <select
                                    value={findingSeverity}
                                    onChange={(e) =>
                                      setFindingSeverity(e.target.value)
                                    }
                                    className="mr-2 border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
                                  >
                                    <option value="info">Info</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  <input
                                    value={findingNotes}
                                    onChange={(e) =>
                                      setFindingNotes(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Notes"
                                    className="border-l border-gray-600 bg-gray-800 px-4 py-2 outline-none"
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
                        <button onClick={() => handleAuditDelete(audit.id)} className="ml-auto mt-1 flex text-xs text-indigo-400 hover:text-indigo-300">
                          <Trash className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        )}
      </Shell>
    </>
  );
};

export default Project;
