import React, { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import "./shape.scss";

const Shape = ({ data }) => {
  const boxes = useMemo(() => data.flat(Infinity), [data]);
  const [selected, setSelected] = useState(new Set());
  const [unloading, setUnloading] = useState(false);
  const timerRef = useRef(null);
  const handleClick = (e) => {
    const { target } = e;
    const index = target.getAttribute("data-index");
    const status = target.getAttribute("data-status");
    console.log(status, index);
    if (index === null || status === "hide" || unloading) return;

    setSelected((prev) => {
      return new Set(prev.add(index));
    });
  };

  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc, box) => {
      if (box === 1) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [boxes]);

  const unLoading = () => {
    const keys = Array.from(selected.keys());

    const removeNextMove = () => {
      if (keys.length) {
        const currentkey = keys.shift();

        setSelected((prev) => {
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentkey);
          return updatedKeys;
        });
        timerRef.current = setTimeout(removeNextMove, 500);
      } else {
        setUnloading(false);
        clearTimeout(timerRef.current);
      }
    };
    timerRef.current = setTimeout(removeNextMove, 100);
  };

  useEffect(() => {
    if (selected.size >= countOfVisibleBoxes) {
      setUnloading(true);
      unLoading();
    }
  }, [selected]);

  return (
    <div className={classnames("boxes")} onClick={(e) => handleClick(e)}>
      {boxes.map((box, index) => {
        const status = box === 1 ? "visible" : "hide";
        const isSelected = selected.has(index.toString());

        return (
          <div
            key={`${box}-${index}`}
            data-index={index}
            data-status={status}
            className={classnames(
              "box rounded-sm",
              status,
              isSelected && "bg-purple-500",
              unloading && "disable-click"
            )}
          ></div>
        );
      })}
    </div>
  );
};

export default Shape;
