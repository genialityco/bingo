import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const LETTER_COLORS = {
  B: "from-red-600 to-red-700",
  I: "from-blue-600 to-blue-700",
  N: "from-green-600 to-green-700",
  G: "from-purple-600 to-purple-700",
  O: "from-orange-500 to-orange-600",
};

const HEADERS_MAP = {
  5: ["B", "I", "N", "G", "O"],
  4: ["B", "I", "N", "G"],
  3: ["B", "I", "N"],
};

export const BallotHistoryTable = ({ bingoConfig, ballotsHistory, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!bingoConfig?.bingo_values || bingoConfig.bingo_values.length === 0) {
    return null;
  }

  const values = bingoConfig.bingo_values;
  const [rows] = bingoConfig.dimensions.split("x").map(Number);
  const dimension = rows || 5;
  const headers = HEADERS_MAP[dimension] || HEADERS_MAP[5];
  const groupSize = Math.ceil(values.length / headers.length);

  const groups = headers.map((letter, i) => ({
    letter,
    ballots: values.slice(i * groupSize, (i + 1) * groupSize),
  }));

  const maxCols = Math.max(...groups.map((g) => g.ballots.length));
  const drawnCount = ballotsHistory.length;
  const isBallotDrawn = (id) => ballotsHistory.includes(id);

  return (
    <div className="w-full">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 py-2 rounded-t-lg text-sm font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all"
      >
        <span>Balotas jugadas: {drawnCount} / {values.length}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {/* Table content */}
      {isOpen && (
        <div className="overflow-x-auto rounded-b-lg shadow-lg">
          <div
            className="min-w-full bg-gray-800/90 p-1.5"
            style={{ minWidth: `${(maxCols + 1) * 32}px` }}
          >
            {/* Column number headers */}
            <div
              className="grid gap-px mb-px"
              style={{
                gridTemplateColumns: `28px repeat(${maxCols}, minmax(22px, 1fr))`,
              }}
            >
              <div />
              {Array.from({ length: maxCols }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-gray-500 text-[10px] font-bold py-0.5"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Rows: B, I, N, G, O */}
            {groups.map(({ letter, ballots }) => (
              <div
                key={letter}
                className="grid gap-px mb-px"
                style={{
                  gridTemplateColumns: `28px repeat(${maxCols}, minmax(22px, 1fr))`,
                }}
              >
                <div
                  className={`bg-gradient-to-b ${LETTER_COLORS[letter] || "from-gray-600 to-gray-700"} flex items-center justify-center rounded-sm`}
                >
                  <span className="text-white text-[10px] font-extrabold">
                    {letter}
                  </span>
                </div>

                {Array.from({ length: maxCols }, (_, colIndex) => {
                  const ballot = ballots[colIndex];
                  if (!ballot) {
                    return (
                      <div key={colIndex} className="bg-gray-700 rounded-sm h-6 lg:h-7" />
                    );
                  }

                  const drawn = isBallotDrawn(ballot._id);
                  const displayValue =
                    ballot.ballot_type === "image"
                      ? null
                      : ballot.ballot_value.length > 3
                        ? ballot.ballot_value.slice(0, 3)
                        : ballot.ballot_value;

                  return (
                    <div
                      key={colIndex}
                      className={`
                        flex items-center justify-center rounded-sm h-6 lg:h-7
                        transition-all duration-300
                        ${drawn
                          ? "bg-gradient-to-b from-yellow-300 to-yellow-400 text-gray-900 font-bold shadow-sm shadow-yellow-500/30"
                          : "bg-gray-600/80 text-gray-400"
                        }
                      `}
                    >
                      {ballot.ballot_type === "image" ? (
                        <img
                          src={ballot.ballot_value}
                          alt=""
                          className={`h-4 w-4 object-contain ${drawn ? "" : "opacity-40"}`}
                        />
                      ) : (
                        <span className="text-[10px] lg:text-[11px] leading-none">{displayValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
