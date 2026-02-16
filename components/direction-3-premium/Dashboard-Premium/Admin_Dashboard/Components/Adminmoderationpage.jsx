import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Store,
  CreditCard,
  Flag,
} from "lucide-react";
import { adminModeration } from "@/app/data/Admindata";

const TYPE_ICON = {
  "Store Approval": Store,
  "Product Review": Flag,
  "Payout Request": CreditCard,
  Dispute: AlertTriangle,
  "Store Suspend": XCircle,
  "Review Flag": Flag,
};

const TYPE_COLOR = {
  "Store Approval": "bg-blue-50 text-blue-700",
  "Product Review": "bg-rose-50 text-rose-700",
  "Payout Request": "bg-purple-50 text-purple-700",
  Dispute: "bg-rose-50 text-rose-700",
  "Store Suspend": "bg-slate-100 text-slate-600",
  "Review Flag": "bg-amber-50 text-amber-700",
};

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700",
  Flagged: "bg-rose-100 text-rose-700",
  Open: "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const PRIORITY_DOT = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-slate-300",
};

export default function AdminModerationPage() {
  const pending = adminModeration.filter((m) =>
    ["Pending", "Open", "Flagged"].includes(m.status),
  ).length;
  const resolved = adminModeration.filter(
    (m) => m.status === "Resolved",
  ).length;
  const high = adminModeration.filter((m) => m.priority === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Moderation & Approvals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {pending} items need action · {high} high priority
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            className="text-xs rounded-full border-slate-200 text-slate-600 gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Audit Log
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open Items", value: pending, color: "rose" },
          { label: "High Priority", value: high, color: "amber" },
          { label: "Resolved", value: resolved, color: "emerald" },
          {
            label: "Payout Queue",
            value: `₹${(18420 + 12800).toLocaleString()}`,
            color: "blue",
          },
        ].map(({ label, value, color }) => (
          <Card
            key={label}
            className="border-slate-200/60 bg-white/90 shadow-sm"
          >
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {label}
              </p>
              <p className={`text-lg font-bold mt-0.5 text-${color}-600`}>
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Moderation queue */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              Action Queue
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Pending", "Flagged", "Open", "Resolved"].map((f) => (
                <button
                  key={f}
                  className={`
      flex-shrink-0
      text-[10px] px-3 py-1.5 rounded-full font-medium
      transition-colors whitespace-nowrap
      ${
        f === "All"
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }
    `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {adminModeration.map((item) => {
              const TypeIcon = TYPE_ICON[item.type] ?? Flag;
              const isActionable = ["Pending", "Open", "Flagged"].includes(
                item.status,
              );
              return (
                <div
                  key={item.id}
                  className={`group transition-colors ${isActionable ? "hover:bg-slate-50/60" : "opacity-60 hover:bg-slate-50/40"}`}
                >
                  <div className="p-3 sm:p-4 md:p-5">
                    {/* Mobile: Stacked layout, Desktop: Flex row */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      {/* Left section with priority dot and type icon - inline on mobile */}
                      <div className="flex items-center gap-2 sm:gap-4 sm:items-start">
                        {/* Priority dot */}
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[item.priority]}`}
                        />

                        {/* Type icon */}
                        <div
                          className={`p-1.5 sm:p-2 rounded-xl ${TYPE_COLOR[item.type]} shrink-0`}
                        >
                          <TypeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>

                      {/* Content - takes full width on mobile */}
                      <div className="flex-1 min-w-0">
                        {/* Badges - wrap on mobile */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${TYPE_COLOR[item.type]}`}
                          >
                            {item.type}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[item.status]}`}
                          >
                            {item.status}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              item.priority === "high"
                                ? "bg-rose-100 text-rose-700"
                                : item.priority === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>

                        {/* Subject and note */}
                        <p className="text-sm sm:text-base font-semibold text-slate-900 break-words">
                          {item.subject}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 break-words">
                          {item.note}
                        </p>

                        {/* Meta info */}
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">
                          Submitted by{" "}
                          <span className="font-medium text-slate-600">
                            {item.submittedBy}
                          </span>{" "}
                          · {item.date}
                        </p>
                      </div>

                      {/* Actions - stacked on mobile, horizontal on desktop */}
                      {isActionable && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mt-2 sm:mt-0 sm:ml-2 shrink-0">
                          <Button
                            size="sm"
                            className="h-8 sm:h-9 px-3 sm:px-4 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-full gap-1 w-full sm:w-auto"
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="sm:inline">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 sm:h-9 px-3 sm:px-4 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full gap-1 w-full sm:w-auto"
                          >
                            <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="sm:inline">Reject</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
