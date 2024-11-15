import { useState } from "react"
import "./Input.css"
export default function Input() {
    const [ image , setimage ] = useState("https://via.placeholder.com/300")
    const [ prompt , setprompt ] = useState("")
    const [ data , setdata ] = useState("Result will appear here")

    const upload = async(e)=>{
        const photo = e.target.files[0];
        const imageUrl = URL.createObjectURL(photo);
        console.log(imageUrl)
        setimage(imageUrl)
        
        const formData = new FormData();
        formData.append("file" , photo)

        const options={
            method:"POST",
            body:formData
        };

        const res = await fetch("https://image-recognition-chatbot-backend.onrender.com/upload" , options)
        console.log(res,await res.json())
        
    }

    const Inputprompt = async(e)=>{
        setprompt(e.target.value)
        console.log(e.target.value)
        
    }

    const Analyse = async()=>{
        const send={
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ message: prompt })
        }

        if(image === "https://via.placeholder.com/300" || prompt === ""){
            alert("select image and write the message")
        }

        setdata("Loading...");
        
        const res = await fetch("https://image-recognition-chatbot-backend.onrender.com/Analyse" , send)
        const data = await res.text();   
        setdata(data)
    }

    const clear = async()=>{
        setdata("Result will appear here")
        setimage("https://via.placeholder.com/300")
        setprompt("")

    }

    const clearprompt =()=>{
        setprompt("");
    }

  return (
    <div className="main">
        <div className="input">
        <img src={image} alt="img" className="img"></img>
        <input type='file' accept='image/*' id='Ifile'onChange={upload} ></input>

        <div className="prompt">
        <input type='text'  id='Tfile' placeholder="Ask about the image" onChange={Inputprompt}  size="80" value={prompt}></input>
        </div>

        <button onClick={Analyse} className="button"> SEND </button>
        <button onClick={clearprompt} className="button"> CLEAR PROMPT </button>
        <button onClick={clear} className="button"> CLEAR </button>
        </div>

        <div className="output">
        <p value={data}>{data}</p>
        </div>

    </div>
  )
}
