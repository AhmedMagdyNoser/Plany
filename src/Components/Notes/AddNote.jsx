import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addNote } from "../../Redux/notesSlice";
import { formatedCurrentDate, randomDigits } from "../../utils";
import { FadeIn } from "../Utils/Fade";

export default function AddNote() {
  const [isNotePopupOpened, setIsNotePopupOpened] = useState(false);

  return (
    <FadeIn milliSeconds="1000">
      <div
        onClick={() => setIsNotePopupOpened(true)}
        className="opacity-hover p-5 text-primary bg-white rounded shadow-sm flex-center flex-column cursor-pointer"
      >
        <div className="border border-primary rounded-circle flex-center" style={{ width: "85px", height: "85px" }}>
          <i className="fa-solid fa-plus fs-2"></i>
        </div>
        <p className="m-0 mt-3">ملاحظة جديدة</p>
      </div>
      <NewNotePopup isOpened={isNotePopupOpened} setIsOpened={setIsNotePopupOpened} />
    </FadeIn>
  );
}

function NewNotePopup({ isOpened, setIsOpened }) {
  let dispatch = useDispatch();
  let titleInput = useRef(null);

  useEffect(() => {
    isOpened && titleInput.current.focus();
  }, [isOpened]);

  window.addEventListener("keydown", (e) => {
    e.key === "Escape" && setIsOpened(false);
  });

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    dispatch(
      addNote({
        id: randomDigits(9),
        title: formData.get("title"),
        description: formData.get("description"),
        time: formatedCurrentDate("ar"),
      })
    );
    e.target.reset();
    setIsOpened(false);
  }

  return (
    <>
      <div className="screen-overlay check-screen flex-center">
        <div className="check-box content bg-white rounded shadow-lg">
          <header className="d-flex align-items-center justify-content-between gap-5 py-3 px-4 border-bottom">
            <h4 className="m-0">اضف ملاحظة جديدة</h4>
            <i onClick={() => setIsOpened(false)} className="fa-solid fa-xmark gray-hover rounded p-2 cursor-pointer"></i>
          </header>

          <form onSubmit={handleSubmit} className="d-flex flex-column p-4 gap-3">
            <input
              name="title"
              type="text"
              required
              ref={titleInput}
              placeholder="العنوان"
              tabIndex={isOpened ? 1 : -1}
              className="form-control shadow-none"
            />
            <textarea
              name="description"
              rows={10}
              required
              placeholder="المحتوى"
              tabIndex={isOpened ? 1 : -1}
              className="form-control shadow-none"
            />
            <input type="submit" value="اضف" tabIndex={isOpened ? 1 : -1} className="btn btn-primary" />
          </form>
        </div>
      </div>

      <style>
        {`
        .check-screen {
          ${isOpened ? "pointer-events: auto; opacity: 1;" : "pointer-events: none; opacity: 0;"}
        }
        .check-box {
          transition: 0.25s ease-in-out; 
          ${isOpened ? "scale: 1; opacity: 1;" : "scale: 0; opacity: 0;"}
        }
        .content {
          width: 500px;
          max-width: 95%;
        }
      `}
      </style>
    </>
  );
}
