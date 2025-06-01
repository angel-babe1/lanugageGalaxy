import React from "react";
import './FormBtn.css';

function FormBtn({ btnValue }) {
    return (
        <button type="submit" className="submit-button" >
            {btnValue}
        </button>
    )
}

export default FormBtn;