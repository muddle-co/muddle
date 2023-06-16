import { ChevronRight, ListPlus } from "lucide-react";
import { useRouter } from "next/router";
import dayjs, { type ManipulateType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Audit = {
  status: keyof typeof statuses;
  createdAt: string;
};

interface Frequency {
  value: number;
  unit: string;
}

type Item = {
  id: string;
  name: string;
  status: keyof typeof statuses;
  result: keyof typeof results;
  date: string;
  audits: Audit[];
  frequency?: Frequency;
  createdAt: string;
};

type Project = {
  id: string;
  name: string;
};

type Props = {
  projects: Project[];
  items: Item[];
  selectedItem: Item;
  setSelectedItem: (item: Item) => void;
};

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

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ItemList({
  projects,
  items,
  selectedItem,
  setSelectedItem,
}: Props) {
  const router = useRouter();

  return (
    <div className="space-y-4">
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
          items.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return -1;
            }
            if (a.createdAt > b.createdAt) {
              return 1;
            }
            return 0;
          }).map((item) => (
            <li
              key={item.id}
              className={classNames(
                selectedItem?.id === item.id ? "bg-gray-800/40" : undefined,
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
                  <p className="min-w-0 truncate text-sm font-semibold leading-6 text-white">
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
                          .add(item.frequency.value, item.frequency.unit as ManipulateType)
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
    </div>
  );
}
