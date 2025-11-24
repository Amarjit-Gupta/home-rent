import { useEffect, useState } from 'react';
import R from '../assets/R.jpeg';
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate, useParams } from "react-router";

import { MdPermIdentity } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { LiaAddressCardSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { Link  } from "react-router";

const SingleCustomerData = () => {

    let url = import.meta.env.VITE_URL;

    const [title, setTitle] = useState("");
    const [area, setArea] = useState("");
    const [rent, setRent] = useState("");
    const [pincode, setPincode] = useState("");
    const [bhk, setBhk] = useState("");
    const [contact, setContact] = useState("");
    const [availability, setAvailability] = useState("");
    const [address, setAddress] = useState("");
    const [fileurl, setFileurl] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [dataId,setDataId] = useState("");

    const navigate = useNavigate();

    const [show,setShow] = useState(false);

    let id = useParams();
    let index = id.id;
    // console.log(index);

    const getSingleData = async () => {
        try {
            let data = await fetch(`${url}/data/getSingleCustomerData/${index}`);
            let result = await data.json();
            console.log(result);

            if (result.success) {
                let d1 = result?.result;
                setTitle(d1?.title);
                setArea(d1?.area);
                setRent(d1?.rent);
                setPincode(d1?.pincode);
                setBhk(d1?.bhk);
                setContact(d1?.contact);
                setAvailability(d1?.availability);
                setAddress(d1?.address);
                setFileurl(d1?.url);
                setUserEmail(d1?.userEmail);
                setDataId(d1?._id)
            }
            else {
                alert(result.message);
            }
        }
        catch (err) {
            alert("something went wrong...");
        }
    }

    useEffect(() => {
        getSingleData();
    }, []);

    // for form

    const [inputValue, setInputValue] = useState({
        name:"",
        phone: "",
        address: ""
    });

    const [error, setError] = useState(false);

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.name || !inputValue.phone || !inputValue.address) {
            setError(true);
            return;
        }
        else if(inputValue.phone.length!==10){
            alert("please enter 10 digit in contact no...");
            return;
        }
        else if( isNaN(inputValue.phone)){
            alert("please enter only number in contact no...");
            return;
        }
        else if (inputValue.name.trim() && inputValue.phone.trim() && inputValue.address.trim()) {
            try {
                console.log(inputValue);
                console.log(userEmail);
                let name = inputValue.name;
                let phone = inputValue.phone;
                let address = inputValue.address;

                let result = await fetch(`${url}/data/sendMail`, {
                    method: "post",
                    body: JSON.stringify({name,phone,address,userEmail,dataId}),
                    headers: { "Content-type": "application/json" }
                });
                let data = await result.json();
                console.log(data);
                // setShow(false);
                // if (data.success) {
                //     console.log(data.auth);
                //     console.log(data.user);
                //     localStorage.setItem("user", JSON.stringify(data.user));
                //     localStorage.setItem("token", JSON.stringify(data.auth));
                //     alert(data.message);
                //     navigate("/");
                //     setShow(false);
                // }
                // else {
                //     alert(data.message);
                //     setShow(false);
                // }
            }
            catch (err) {
                console.log(err);
                alert("something went wrong...", err.message);
            }
        }
        else {
            alert("white space is not allowed...");
        }
    }

    return (
        <div className="border">
            <ToastContainer />
            <h1 className="text-2xl sm:text-3xl text-center mt-3 md:mt-5 underline">Single Property Details</h1>



            <div className="border w-79 p-2 rounded-xl m-auto mt-[2%]">
                <div className="w-full h-50 border rounded-sm mb-2">{fileurl && <img src={fileurl} alt="" className="w-full h-full rounded-t-sm" />}</div>
                <div className=" text-xl font-medium h-15 px-1">Title: <span className="font-normal">{title}</span></div>

                <div className=" text-xl font-medium h-8 px-1">
                    Area: <span className="font-normal">{area} sq ft</span>
                </div>
                <div className=" text-xl font-medium h-8 px-1">
                    Rent: <span className="font-normal">₹{rent}</span>
                </div>
                <div className=" text-xl font-medium h-8 px-1">
                    Pincode:  <span className="font-normal">{pincode}</span>
                </div>
                <div className=" text-xl font-medium h-8 px-1 flex justify-between">
                    <span>BHK: <span className="font-normal">{bhk}</span></span>

                    {/* <span className="font-normal bg-green-300">Booked</span> */}
                </div>
                <div className=" text-xl font-medium h-8 px-1">
                    Contact No: <span className="font-normal">{contact}</span>
                </div>
                <div className=" text-xl font-medium h-8 px-1">
                    Availability: <span className="font-normal">{availability == "Available" ? "Available" : <span className="bg-green-300 px-2 rounded-xl">Booked</span>}</span>
                </div>
                <div className="text-xl font-medium h-15 px-1">
                    Address: <span className="font-normal">{address}</span>
                </div>
                <div className="border font-medium h-10 rounded-b-sm px-1 flex justify-center text-xl">
                    <button className='text-green-500 cursor-pointer flex justify-center items-center gap-5'>See more<LuSquareArrowOutUpRight /></button>
                </div>
            </div>

            <button className='text-red-500 p-1 text-xl border m-4 absolute top-100 right-100' onClick={()=>setShow(true)}>book now</button>


            <div className={`h-screen w-full bg-gray-500/50 fixed left-0 flex justify-center items-center ${show?"top-0":"x1"}`}>
                <div className="w-79 border rounded-xl p-4 sm:pt-6 sm:pb-8 sm:px-6 sm:w-100 bg-black">
                    <button className="border float-right p-1 font-medium rounded cursor-pointer bg-green-300" onClick={()=>setShow(false)}><RxCross2 /></button>
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
                            <LiaAddressCardSolid className="text-3xl text-gray-700" /><textarea className="w-[75%] resize-none outline-0" name="address" value={inputValue.address} onChange={handleChange} placeholder="Enter Your Address..."></textarea>
                        </div>
                        {error && !inputValue.address && <p className="ml-1 text-red-500">Please Enter Address...</p>}

                        <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                            <button className="h-full w-full rounded-2xl cursor-pointer">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default SingleCustomerData;