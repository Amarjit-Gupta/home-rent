import { useState } from "react";
import { MdPermIdentity } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { LiaAddressCardSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router";
const Form = () => {

    const [inputValue, setInputValue] = useState({
        name:"",
        phone: "",
        address: ""
    });

    let url = import.meta.env.VITE_URL;

    let navigate = useNavigate();

    const [error, setError] = useState(false);

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    console.log(inputValue);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // if (!inputValue.email || !inputValue.password) {
        //     setError(true);
        //     return;
        // }
        // else if (inputValue.email.trim() && inputValue.password.trim()) {
        //     try {
        //         let result = await fetch(`${url}/auth/login`, {
        //             method: "post",
        //             body: JSON.stringify(inputValue),
        //             headers: { "Content-type": "application/json" }
        //         });
        //         let data = await result.json();
        //         //console.log(data);
        //         if (data.success) {
        //             console.log(data.auth);
        //             console.log(data.user);
        //             localStorage.setItem("user", JSON.stringify(data.user));
        //             localStorage.setItem("token", JSON.stringify(data.auth));
        //             alert(data.message);
        //             navigate("/");
        //         }
        //         else {
        //             alert(data.message);
        //         }
        //     }
        //     catch (err) {
        //         console.log(err);
        //         alert("something went wrong...", err.message);
        //     }
        // }
        // else {
        //     alert("white space is not allowed...");
        // }
    }

    return (

            <div className="w-79 border rounded-xl p-4 sm:pt-6 sm:pb-8 sm:px-6 sm:w-100 bg-black">
                <button className="border float-right p-1 font-medium rounded cursor-pointer bg-green-300"><RxCross2 /></button>
                <h2 className="text-center text-xl text-gray-600 mb-3 sm:text-2xl">Fill Details</h2>
                <form onSubmit={handleSubmit}>

                    <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                        <MdPermIdentity className="text-3xl text-gray-700" /><input type="text" placeholder="Enter Name..." className="focus:outline-0 w-[75%]" name="name" value={inputValue.name} onChange={handleChange} />
                    </div>
                    {error && !inputValue.name && <p className="ml-1 text-red-500">Please Enter Name...</p>}
                    
                    <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                        <IoIosContact className="text-3xl text-gray-700" /><input type="tel" placeholder="Enter Phone No..." className="focus:outline-0 w-[75%]" name="phone" value={inputValue.phone} onChange={handleChange} />
                    </div>
                    {error && !inputValue.phone && <p className="ml-1 text-red-500">Please Enter Phone No...</p>}

                    <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                        <LiaAddressCardSolid className="text-3xl text-gray-700" /><textarea className="w-[75%] resize-none outline-0" name="address" value={inputValue.address} onChange={handleChange}></textarea>
                    </div>
                    {error && !inputValue.address && <p className="ml-1 text-red-500">Please Enter Address...</p>}

                    <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                        <button className="h-full w-full rounded-2xl cursor-pointer">Submit</button>
                    </div>
                </form>
            </div>
    );
};
export default Form;