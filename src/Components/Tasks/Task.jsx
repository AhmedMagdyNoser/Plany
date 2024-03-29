import { useEffect, useRef, useState } from "react";
import { removeTask, updateTask } from "../../Redux/tasksSlice";
import { FadeIn, RemoveWithFadeOut } from "../Utils/Fade";
import { useDispatch } from "react-redux";
import { formatDateAndTime } from "../../utils";
import checkedSound from "./../../Sounds/checked.mp3";

let uncheckedStyle = "fa-regular fa-circle fa-xl cursor-pointer";
let checkedStyle = "fa-solid fa-circle-check fa-xl cursor-pointer";
let hoverStyle = "fa-regular fa-circle-check fa-xl cursor-pointer";

export default function Task({ task }) {
  const dispatch = useDispatch();

  let [iconStyle, setIconStyle] = useState("");
  let [titleStyle, setTitleStyle] = useState("");

  const card = useRef(0);

  const checkedAudio = new Audio(checkedSound);

  function checkIfChecked() {
    if (task.isChecked) {
      setIconStyle(checkedStyle);
      setTitleStyle("text-decoration-line-through");
    } else {
      setIconStyle(uncheckedStyle);
      setTitleStyle("");
    }
  }

  useEffect(() => {
    checkIfChecked();
    // eslint-disable-next-line
  }, [task.isChecked]);

  function handleMouseEnter() {
    setIconStyle(hoverStyle);
  }

  function handleMouseLeave() {
    if (task.isChecked) {
      setIconStyle(checkedStyle);
    } else {
      setIconStyle(uncheckedStyle);
    }
  }

  function handleRemoveTask() {
    dispatch(removeTask(task.id));
  }

  function handleUpdateChecked() {
    if (task.isChecked) dispatch(updateTask({ id: task.id, isNotificationOn: task.isNotificationOn, isChecked: false }));
    else {
      dispatch(updateTask({ id: task.id, isNotificationOn: task.isNotificationOn, isChecked: true }));
      checkedAudio.play();
    }
  }

  function handleIsNotificationOn() {
    if (task.isNotificationOn) dispatch(updateTask({ id: task.id, isNotificationOn: false, isChecked: task.isChecked }));
    else dispatch(updateTask({ id: task.id, isNotificationOn: true, isChecked: task.isChecked }));
  }

  return (
    <FadeIn milliSeconds="1000">
      <div ref={card} className="py-3 px-4 flex-center justify-content-between border-bottom gray-hover">
        <div className="flex-center">
          <i onClick={handleUpdateChecked} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={iconStyle}></i>
          <div className="px-3">
            <p className={"my-1 fw-bold trancate-1 " + titleStyle}>{task.title}</p>
            {task.time && <small className="text-muted trancate-1">{formatDateAndTime(task.time, "ar")}</small>}
          </div>
        </div>

        <div className="flex-center gap-4 mx-2">
          {task.isNotificationOn !== null && (
            <i
              onClick={handleIsNotificationOn}
              className={
                (task.isNotificationOn ? "fa-solid fa-bell text-primary" : "fa-regular fa-bell-slash") + " fs-5 opacity-hover cursor-pointer"
              }
            ></i>
          )}
          <RemoveWithFadeOut milliSeconds="250" fadeOutElement={card.current} removeFunction={handleRemoveTask}>
            <i className="fa-solid fa-trash-can fs-5 opacity-hover cursor-pointer"></i>
          </RemoveWithFadeOut>
        </div>
      </div>
    </FadeIn>
  );
}
