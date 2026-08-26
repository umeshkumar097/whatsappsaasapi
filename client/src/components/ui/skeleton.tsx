/**
 * ============================================================
 * © 2026 Aiclex Technologies
 * Original Author: Aiclex Engineering Team
 * Website: https://aiclex.in
 * Contact: info@aiclex.in
 *
 * All rights reserved.
 * ============================================================
 */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
