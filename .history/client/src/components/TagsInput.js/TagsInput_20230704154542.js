import {useState} from 'react';

function TagsInput() {
    const [tags, setTags] = useState([]);

    function handleKeyDown(e){
        if(e.key !== 'Enter') return 
        const value = e.target.value
        if(!value.trim()) return
        setTags([...tags, value])

    }

    return (
        <div className="tags-input-container">
        {/* <div className="tag-item">
            <span className="text">hello</span>
            <span className="close">&times;</span>
        </div> */}
        
        { tags.map((tag, index) => (
            <div className="tag-item">
                <span className="text">hello</span>
                <span className="close">&times;</span>
            </div> 
        )) }

        <input onKeyDown={type="text" className="tags-input" placeholder="Type something" />
        </div>
  );
}

export default TagsInput;
