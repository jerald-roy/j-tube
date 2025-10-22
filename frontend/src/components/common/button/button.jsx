import "./button.css"

function Button({ text , onClick , id=0 }) {
    return <div className="relative z-0">
        <button className="my-custom-button" onClick={onClick} type={onClick ? "button" : "submit"} id={id}>{text}
            
             </button>
        </div>
}

export default Button