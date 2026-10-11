export const JOB_STATUSES = ["QUEUED", "SCHEDULED", "RUNNING", "COMPLETED", "FAILED", "INTERRUPTED", "CANCELLED"];

export function jobStatusLabel(status) {
  return status[0] + status.slice(1).toLowerCase();
}

function sortValue(job, key) {
  if (key === "age") return job.createdAt ? -Date.parse(job.createdAt) : null;
  if (key === "updated") return job.updatedAt ? Date.parse(job.updatedAt) : null;
  if (key === "worker") return job.assignedWorkerName;
  return job[key];
}

/** Filters and sorting apply only to the recent rows supplied by the API. */
export function selectQueueJobs(jobs, { filter = "ALL", query = "", worker = "ALL", sort = { key: "updated", direction: "desc" } } = {}) {
  const search = query.trim().toLowerCase();
  return jobs.filter((job) => {
    const haystack = [job.name, job.id, job.workloadType.replace(/_/g, " "), job.assignedWorkerName, job.execution?.containerShortId].join(" ").toLowerCase();
    return (filter === "ALL" || job.status === filter)
      && (worker === "ALL" || (worker === "UNASSIGNED" ? !job.assignedWorkerId : job.assignedWorkerId === worker))
      && (!search || haystack.includes(search));
  }).sort((a, b) => {
    const left = sortValue(a, sort.key);
    const right = sortValue(b, sort.key);
    const missing = (value) => value == null || (typeof value === "number" && !Number.isFinite(value));
    if (missing(left)) return missing(right) ? 0 : 1;
    if (missing(right)) return -1;
    const compared = typeof left === "string" ? left.localeCompare(right, undefined, { numeric: true }) : left - right;
    return sort.direction === "desc" ? -compared : compared;
  });
}

export function jobAge(createdAt, now) {
  if (!createdAt || !Number.isFinite(Date.parse(createdAt)) || !Number.isFinite(now)) return "—";
  const seconds = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
