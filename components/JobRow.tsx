import Link from "next/link";
import type { Vacature } from "@/lib/types";

export function JobRow({ job, nieuw = false, className = "", style }: {
  job: Pick<Vacature, "slug" | "title" | "regio" | "contract"> & { domein: string };
  nieuw?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link href={`/vacatures/${job.slug}`} className={`job ${className}`} style={style}>
      <span style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="job-title">{job.title}</span>
        {nieuw && (
          <span className="badge-new">
            <span className="dot a-pulse-blue" style={{ width: 8, height: 8 }} />
            Nieuw
          </span>
        )}
      </span>
      <span className="job-meta">{job.domein}</span>
      <span className="job-meta">{job.regio}</span>
      <span className="job-meta">{job.contract}</span>
      <span className="job-pill hide-m" aria-hidden="true" />
    </Link>
  );
}
