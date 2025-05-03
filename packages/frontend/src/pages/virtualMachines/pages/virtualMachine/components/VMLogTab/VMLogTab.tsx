import trpc from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import LogControlPanel from "./components/LogsControlPanel";
import { useAppDispatch } from "@/utils/redux";
import { addNotification } from "@/store/notification";
import { nanoid } from "@reduxjs/toolkit";

type Props = { instanceId: string };
type Match = { lineIdx: number; occIdx: number };

export default function VMLogTab({ instanceId }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatch, setActiveMatch] = useState(0);

  const containerRef = useRef<HTMLPreElement>(null);

  /* 1) подписываемся на логи */
  useEffect(() => {
    const sub = trpc.vm.streamLogs.subscribe(
      { id: instanceId },
      {
        onData: (line) => setLines((p) => [...p, line]),
        onError: console.error,
      }
    );
    return () => sub.unsubscribe();
  }, [instanceId]);

  /* 3) пересчёт совпадений */
  useEffect(() => {
    if (!search) {
      setMatches([]);
      setActiveMatch(0);
      return;
    }
    const list: Match[] = [];
    const re = new RegExp(search, "gi");
    lines.forEach((line, lineIdx) => {
      let m: RegExpExecArray | null;
      let occIdx = 0;
      while ((m = re.exec(line))) {
        list.push({ lineIdx, occIdx });
        occIdx++;
      }
    });
    setMatches(list);
    setActiveMatch(0);
  }, [search, lines]);

  const dispatch = useAppDispatch();

  /* 5) helpers */
  const copyAll = () =>
    navigator.clipboard.writeText(lines.join("\n")).then(() =>
      dispatch(
        addNotification({
          id: nanoid(),
          title: "Логи скопированы",
          description: "Текст логов успешно скопирован в буфер обмена",
          type: "info",
        })
      )
    );
  const prev = () =>
    setActiveMatch((p) => (p <= 0 ? matches.length - 1 : p - 1));
  const next = () =>
    setActiveMatch((p) => (p >= matches.length - 1 ? 0 : p + 1));

  /* 6) разбивка строки на части для подсветки */
  const renderHighlighted = (text: string) => {
    if (!search) return [text];
    return text.split(new RegExp(`(${search})`, "gi"));
  };

  return (
    <div className="flex flex-col flex-1 p-2 bg-white rounded-2xl gap-2">
      <LogControlPanel
        searchPhrase={search}
        onChangeSearch={setSearch}
        hasMatches={matches.length > 0}
        matchCount={matches.length}
        activeMatch={activeMatch}
        onPrevMatchClick={prev}
        onNextMatchClick={next}
        onCopyAllClick={copyAll}
      />

      {/* Обёртка фиксированной высоты и внутренних скроллов */}
      <div className="flex-1 overflow-hidden">
        <pre
          ref={containerRef}
          className="h-full overflow-y-auto bg-black text-green-400 p-4 rounded-lg text-sm whitespace-pre-wrap"
        >
          {(() => {
            let globalIdx = -1;
            return lines.map((line, lineIdx) => (
              <div key={lineIdx}>
                {renderHighlighted(line).map((part, i) => {
                  if (search && part.toLowerCase() === search.toLowerCase()) {
                    globalIdx++;
                    const isActive = globalIdx === activeMatch;
                    return (
                      <mark
                        key={i}
                        data-match-index={globalIdx}
                        className={`${
                          isActive ? "bg-yellow-400" : "bg-yellow-200"
                        } text-black`}
                      >
                        {part}
                      </mark>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            ));
          })()}
        </pre>
      </div>
    </div>
  );
}
