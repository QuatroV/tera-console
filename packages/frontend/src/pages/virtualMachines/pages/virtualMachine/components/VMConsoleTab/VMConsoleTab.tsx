import { useEffect, useRef, useState } from "react";
import trpc from "@/utils/api";
import Button from "@/components/Button";

type Props = { instanceId: string };

// Одна команда из истории
type HistoryIndex = number; // -1 — нет текущего выбора

export default function VMConsoleTab({ instanceId }: Props) {
  const [cmd, setCmd] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<HistoryIndex>(-1);

  const subRef = useRef<ReturnType<
    typeof trpc.vm.execCommand.subscribe
  > | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Запуск команды
  const run = () => {
    const c = cmd.trim();
    if (!c) return;

    // Добавляем в историю и сбрасываем индекс
    setHistory((h) => [...h, c]);
    setHistoryIndex(-1);

    // Пишем команду в вывод
    setLines((l) => [...l, `$ ${c}`]);
    setCmd("");

    // Отменяем предыдущий стрим
    subRef.current?.unsubscribe();

    // Подписываемся на новый вывод
    const sub = trpc.vm.execCommand.subscribe(
      { instanceId, command: c },
      {
        onData(output) {
          setLines((l) => [...l, output]);
        },
        onError(err) {
          console.error("exec error", err);
          setLines((l) => [...l, `Error: ${err.message}`]);
        },
      }
    );
    subRef.current = sub;
  };

  // Автоскролл вниз при новых строках
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  // Обработка клавиш в инпуте
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setCmd(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) {
        setCmd("");
      } else {
        const idx = historyIndex + 1;
        if (idx >= history.length) {
          setHistoryIndex(-1);
          setCmd("");
        } else {
          setHistoryIndex(idx);
          setCmd(history[idx]);
        }
      }
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg h-[500px]">
      {/* Терминал: фиксированная высота, прокрутка внутри */}
      <div className="flex flex-col bg-black text-green-400 font-mono text-sm rounded-lg overflow-hidden h-full">
        {/* Вывод */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 py-1 whitespace-pre"
        >
          {lines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
        {/* Ввод */}
        <div className="flex items-center px-2 py-1 border-t border-green-700">
          <span>$&nbsp;</span>
          <input
            type="text"
            className="bg-transparent flex-1 focus:outline-none font-mono text-green-400 text-sm"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>

      {/* Кнопка очистки */}
      <div className="mt-2 flex justify-end">
        <Button variant="outlined" size="small" onClick={() => setLines([])}>
          Очистить
        </Button>
      </div>
    </div>
  );
}
