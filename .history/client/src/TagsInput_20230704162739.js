import { useState } from "react";

function TagsInput() {
  const [tags, setTags] = useState([]);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }

  return (
    <div className="input-field">
      {/* <div className="tag-item">
            <span className="text">hello</span>
            <span className="close">&times;</span>
        </div> */}

      {tags.map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          <span className="close" onClick={() => removeTag(index)}>
            &times;
          </span>
        </div>
      ))}

      <input
        onKeyDown={handleKeyDown}
        type="text"
        className="input-field"
        placeholder="Enter tags by pressing enter"
      />
    </div>
  );
}

export default TagsInput;
