import { useState } from "react";
import { JOB_STATUSES, jobStatusLabel, selectQueueJobs, jobAge } from "../job-queue.view.js";
import { Icon } from "./Icon.jsx";

const STATUS_ICONS = { COMPLETED: "check", FAILED: "close", INTERRUPTED: "stop", CANCELLED: "close", RUNNING: "play", SCHEDULED: "clock", QUEUED: "clock" };
const COLUMNS = [
  ["name", "Job"], ["worker", "Worker"], ["status", "Status"], ["age", "Age"],
  ["cpuRequiredMillicores", "CPU request"], ["memoryRequiredMiB", "Memory request"],
  ["priority", "Priority"], ["estimatedDurationSeconds", "Estimate"],
];

function containerLabel(job) {
  if (!job.execution) return "Not started";
  const { status, containerShortId, elapsedSeconds, exitCode } = job.execution;
  if (status === "RUNNING") return `${containerShortId ?? "running"} · ${elapsedSeconds ?? 0}s`;
  if (status === "COMPLETED") return `exit ${exitCode ?? "?"} · ${elapsedSeconds ?? 0}s`;
  return `${status.toLowerCase()} · exit ${exitCode ?? "?"}`;
}

function ResourceRequest({ value, capacity, unit, kind }) {
  const percentage = capacity > 0 ? Math.max(0, Math.min(100, value / capacity * 100)) : null;
  return (
    <div className={`queue-resource queue-resource-${kind}`}>
      {percentage !== null ? (
        <span className="queue-resource-track" aria-hidden="true" title={`${Math.round(value / capacity * 100)}% of assigned worker capacity`}>
          <span style={{ width: `${percentage}%` }} />
        </span>
      ) : null}
      <span>{value}{unit}</span>
      {percentage !== null ? <span className="sr-only"> of {capacity}{unit} assigned worker capacity</span> : null}
    </div>
  );
}

export function JobQueue({ jobs, totalJobs = jobs.length, workers = [], capturedAt, selectedJobId, filter, onFilterChange, onSelectJob }) {
  const [query, setQuery] = useState("");
  const [worker, setWorker] = useState("ALL");
  const [sort, setSort] = useState({ key: "updated", direction: "desc" });
  const visible = selectQueueJobs(jobs, { filter, query, worker, sort });
  const counts = Object.fromEntries(JOB_STATUSES.map((status) => [status, jobs.filter((job) => job.status === status).length]));
  const workerById = new Map(workers.map((entry) => [entry.id, entry]));
  const now = capturedAt ? Date.parse(capturedAt) : Date.now();
  const limited = totalJobs > jobs.length;
  const hasFilters = filter !== "ALL" || query !== "" || worker !== "ALL";
  const resetFilters = () => { setQuery(""); setWorker("ALL"); onFilterChange("ALL"); };
  const sortBy = (key) => setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));

  return (
    <section id="job-queue" className="panel queue-panel" aria-label="Job queue">
      <header className="panel-head">
        <h2>Job queue <span className="section-count">{totalJobs} {totalJobs === 1 ? "job" : "jobs"}</span></h2>
        <button type="button" className="link queue-order" onClick={() => setSort({ key: "updated", direction: "desc" })}
          aria-pressed={sort.key === "updated"}>Latest updates <Icon name="sort" /></button>
      </header>

      <div className="queue-toolbar">
        <label className="queue-search">
          <span className="queue-field-label">Search jobs</span>
          <span className="queue-search-input"><Icon name="search" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, type, worker or container" />
          </span>
        </label>
        <div className="queue-worker-filter">
          <label className="queue-field-label" htmlFor="queue-worker">Worker</label>
          <select id="queue-worker" value={worker} onChange={(event) => setWorker(event.target.value)}>
            <option value="ALL">All workers</option>
            <option value="UNASSIGNED">Unassigned</option>
            {workers.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
            {worker !== "ALL" && worker !== "UNASSIGNED" && !workerById.has(worker) ? <option value={worker}>Unavailable worker</option> : null}
          </select>
        </div>
      </div>
      <div className="filters queue-filters" role="group" aria-label="Filter jobs by status">
        {["ALL", ...JOB_STATUSES].map((option) => (
          <button key={option} type="button" className={`chip${filter === option ? " chip-on" : ""}`}
            aria-pressed={filter === option} onClick={() => onFilterChange(option)}>
            {option === "ALL" ? "All" : jobStatusLabel(option)}
            <span className="queue-filter-count">{option === "ALL" ? jobs.length : counts[option]}</span>
          </button>
        ))}
      </div>
      <div className="queue-summary">
        <p className="hint">{visible.length} of {jobs.length} {limited ? "recent " : ""}jobs shown{limited ? ` · ${totalJobs} total; search and filters cover loaded jobs` : ""}</p>
        {hasFilters ? <button type="button" className="link" onClick={resetFilters}>Clear filters</button> : null}
      </div>

      {visible.length === 0 ? (
        <div className="queue-empty">
          <Icon name="search" />
          <p className="muted">{jobs.length === 0 ? "No jobs yet. Generate a workload to fill the queue." : "No jobs match these filters. Try another search or clear the filters."}</p>
        </div>
      ) : (
        <div className="table-scroll queue-table-scroll" role="region" aria-label="Job queue table" tabIndex={0}>
          <table className="grid queue-table">
            <thead><tr>
              <th scope="col" className="queue-health-column"><span className="sr-only">State indicator</span></th>
              {COLUMNS.map(([key, label]) => (
                <th key={key} scope="col" title={key === "cpuRequiredMillicores" ? "Millicores: 1000m = 1 CPU core" : undefined}
                  aria-sort={sort.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                  <button type="button" className="queue-sort" onClick={() => sortBy(key)}>
                    {label}<Icon name={sort.key === key ? (sort.direction === "asc" ? "arrowUp" : "arrowDown") : "sort"} />
                  </button>
                </th>
              ))}
              <th scope="col">Container / result</th>
            </tr></thead>
            <tbody>{visible.map((job) => {
              const assignedWorker = workerById.get(job.assignedWorkerId);
              return (
                <tr key={job.id} className={`job-row${selectedJobId === job.id ? " is-selected" : ""}`} onClick={() => onSelectJob(job.id)}>
                  <td className="queue-health-column">
                    <span className={`queue-state-icon queue-state-${job.status.toLowerCase()}`} title={jobStatusLabel(job.status)} aria-hidden="true">
                      <Icon name={STATUS_ICONS[job.status] ?? "info"} />
                    </span>
                  </td>
                  <td className="queue-job-cell">
                    <button type="button" className="link queue-job-name" aria-pressed={selectedJobId === job.id}>{job.name}</button>
                    <small className="queue-job-type">{job.workloadType.replace(/_/g, " ").toLowerCase()}
                      {job.status === "QUEUED" && job.secondsUntilEligible > 0 ? ` · eligible in ${job.secondsUntilEligible}s` : ""}
                    </small>
                  </td>
                  <td>{job.assignedWorkerName ?? <span className="muted">Unassigned</span>}</td>
                  <td><span className={`status status-${job.status.toLowerCase()}`}>{jobStatusLabel(job.status)}</span></td>
                  <td>{job.createdAt ? <time dateTime={job.createdAt} title={`Created ${new Date(job.createdAt).toLocaleString()}`}>{jobAge(job.createdAt, now)}</time> : "—"}</td>
                  <td><ResourceRequest value={job.cpuRequiredMillicores} capacity={assignedWorker?.cpuCapacityMillicores} unit="m" kind="cpu" /></td>
                  <td><ResourceRequest value={job.memoryRequiredMiB} capacity={assignedWorker?.memoryCapacityMiB} unit=" MiB" kind="memory" /></td>
                  <td>{job.priority}</td>
                  <td>{job.estimatedDurationSeconds}s</td>
                  <td className="mono">{containerLabel(job)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      <p className="hint queue-resource-note">CPU and memory are job requests. Bars show the share of assigned worker capacity, including for finished jobs. Age is time since creation.</p>
    </section>
  );
}
