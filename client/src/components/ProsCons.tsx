import { CheckCircle2, XCircle } from "lucide-react";

interface ProsConsProps {
  title: string;
  pros: string[];
  cons: string[];
}

export function ProsCons({ title, pros, cons }: ProsConsProps) {
  return (
    <div className="my-8 border border-border rounded-lg overflow-hidden">
      <div className="bg-secondary p-4">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Pros */}
        <div className="p-6 border-r border-border">
          <h4 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Pros
          </h4>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-6">
          <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Cons
          </h4>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
