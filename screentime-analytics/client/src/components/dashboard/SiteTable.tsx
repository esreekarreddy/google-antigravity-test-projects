import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { SiteData } from "@/lib/mockData";
import { motion } from "framer-motion";

interface SiteTableProps {
  data: { domain: string; stats: SiteData }[];
  maxTime: number;
}

export function SiteTable({ data, maxTime }: SiteTableProps) {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return m > 0 ? `${m}m` : `${seconds}s`;
  };

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center"
      >
        <p className="text-sm sm:text-base text-muted-foreground">No activity yet. Start browsing to see your data here!</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile: Card layout */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="md:hidden space-y-3"
      >
        {data.map(({ domain, stats }) => (
          <motion.div 
            variants={item} 
            key={domain} 
            className="glass-card rounded-2xl p-4 sm:p-5"
            data-testid={`card-site-${domain}`}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="size-7 sm:size-8 rounded-full bg-white/10 p-1 shadow-sm flex items-center justify-center flex-shrink-0">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} 
                  alt="" 
                  className="size-4 sm:size-5 rounded-full"
                  onError={(e) => e.currentTarget.src = "https://www.google.com/s2/favicons?domain=example.com"}
                />
              </div>
              <span className="font-bold text-sm truncate">{domain}</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <p className="text-muted-foreground font-medium">Usage</p>
                  <p className="font-bold">{Math.round((stats.activeTime / maxTime) * 100)}%</p>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activeTime / maxTime) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div>
                  <p className="text-muted-foreground mb-1">Time</p>
                  <p className="font-mono font-bold">{formatDuration(stats.activeTime)}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground mb-1">Visits</p>
                  <p className="font-mono font-bold">{stats.visits}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Desktop: Table layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:block glass-card rounded-3xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5 border-b border-white/10">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="w-[300px] pl-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Website</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage</TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</TableHead>
                <TableHead className="text-right pr-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Visits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(({ domain, stats }, idx) => (
                <motion.tr 
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.05) }}
                  className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  data-testid={`row-site-${domain}`}
                >
                  <TableCell className="font-medium pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} 
                          alt="" 
                          className="size-4 opacity-80 group-hover:opacity-100 transition-opacity"
                          onError={(e) => e.currentTarget.src = "https://www.google.com/s2/favicons?domain=example.com"}
                        />
                      </div>
                      <span className="font-semibold text-foreground/80 group-hover:text-primary transition-colors">{domain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[40%]">
                    <div className="w-full max-w-[200px] flex items-center gap-3">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${maxTime > 0 ? (stats.activeTime / maxTime) * 100 : 0}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + (idx * 0.05), ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                        {Math.round((stats.activeTime / maxTime) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium text-foreground/70">
                    {formatDuration(stats.activeTime)}
                  </TableCell>
                  <TableCell className="text-right pr-8 font-mono text-sm font-medium text-foreground/70">
                    {stats.visits}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </>
  );
}
