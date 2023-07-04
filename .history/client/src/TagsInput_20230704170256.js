import React from "react";

function TagsInput({ tags, setTags }) {
  const [tagInput, setTagInput] = React.useState("");

  const handleTagInputChange = (value) => {
    setTagInput(value);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  return (
    <div className="input-field">
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
        value={tagInput}
        onChange={(e) => handleTagInputChange(e.target.value)}
        type="text"
        className="input-field"
        placeholder="Enter tags by pressing enter"
      />
    </div>
  );
}

export default TagsInput;
