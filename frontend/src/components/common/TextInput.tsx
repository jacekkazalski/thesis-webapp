import React from "react";

interface Props {
    label: string;
    type: string;
    text: string;
    placeholder: string;
}
export default function TextInput({placeholder,type, label}: Props) {
    const [text, setText] = React.useState(label);
    return(
        <div>
            <label>{label}</label>
            <input
                type={type}
                value={text}
                placeholder={placeholder}
                onChange={(e) => setText(e.target.value)}
            />
        </div>

    );
}