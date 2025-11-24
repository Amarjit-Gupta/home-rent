import { useEffect, useState } from 'react';
import R from '../assets/R.jpeg';

import { ToastContainer, toast } from 'react-toastify';
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router";

const AllData = () => {

    let url = import.meta.env.VITE_URL;

    const [value, setValue] = useState([]);

    const [sort, setSort] = useState("All");

    const [search, serSearch] = useState("");
    console.log(sort);

    const navigate = useNavigate();

    const getAllData = async () => {
        let URL = `${url}/data/getData?`;
        if (sort === "asc") {
            URL += "sort=asc";
        }
        if (sort === "desc") {
            URL += "sort=desc";
        }
        console.log("url: ", URL);
        try {
            let data = await fetch(URL, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            });
            let result = await data.json();
            console.log(result);

            if (result.success) {
                setValue(result.result);
                // alert(result.message);
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
        getAllData();
    }, [sort]);

    const handleDelete = async (index) => {
        try {
            let data = await fetch(`${url}/data/deleteData/${index}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            });
            let result = await data.json();
            console.log(result);

        }
        catch (err) {
            alert("something went wrong...");
        }
    }

    const handleChange = async (e) => {
        try {
            let key = e.target.value;
            console.log(key);
            if (key) {
                let result = await fetch(`${url}/data/searchAdminData/${key}`,{
                    method:"get",
                    headers:{
                        "Content-Type":"application/json",
                        "authorization":`Bearer ${JSON.parse(localStorage.getItem("token"))}`
                    }
                });
                let data = await result.json();
                console.log(data);
                if (data.success) {
                    setValue(data.result);
                    // alert(result.message);
                }
                else {
                    alert(result.message);
                }
            }
            else {
                getAllData();
            }
        }
        catch (err) {
            alert("something went wrong...");
        }
    }

    return (
        <div className="border">
            <ToastContainer />
            <h1 className="text-2xl sm:text-3xl text-center mt-3 md:mt-5 underline">All Property Details</h1>
            <div className="border border-red-500 w-60 flex flex-col gap-3 sm:w-150 m-auto mt-[2%] sm:flex-row justify-between">
                <input type="search" placeholder="Search here..." className="border w-60 h-10 text-xl rounded-xl px-2" onChange={handleChange} />
                <select name="" id="" className="border w-60 h-10 text-xl px-1 rounded-xl bg-gray-50 outline-0" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sort by price</option>
                    <option value="asc">ascending</option>
                    <option value="desc">descending</option>
                </select>
            </div>

            <div className="w-79 md:w-[665px] xl:w-252 border m-auto mt-[2%] flex flex-wrap gap-7">

                {
                    value.length ?
                        value?.map((item, i) => {
                            return (
                                <div className="border w-79 p-2 rounded-xl" key={item._id}>
                                    <div className="w-full h-50 border rounded-sm mb-2"><img src={item.url} alt="" className="w-full h-full rounded-t-sm" />{console.log(item.url)}</div>
                                    <div className=" text-xl font-medium h-15 px-1">Title: <span className="font-normal">{item?.title}</span></div>

                                    <div className=" text-xl font-medium h-8 px-1">
                                        Area: <span className="font-normal">{item?.area} sq ft</span>
                                    </div>
                                    <div className=" text-xl font-medium h-8 px-1">
                                        Rent: <span className="font-normal">₹{item?.rent}</span>
                                    </div>
                                    <div className=" text-xl font-medium h-8 px-1">
                                        Pincode:  <span className="font-normal">{item?.pincode}</span>
                                    </div>
                                    <div className=" text-xl font-medium h-8 px-1 flex justify-between">
                                        <span>BHK: <span className="font-normal">{item?.bhk}</span></span>

                                        {/* <span className="font-normal bg-green-300">Booked</span> */}
                                    </div>
                                    <div className=" text-xl font-medium h-8 px-1">
                                        Contact No: <span className="font-normal">{item?.contact}</span>
                                    </div>
                                    <div className=" text-xl font-medium h-8 px-1">
                                        Availability: <span className="font-normal">{item?.availability == "Available" ? "Available" : <span className="bg-green-300 px-2 rounded-xl">Booked</span>}</span>
                                    </div>
                                    <div className="text-xl font-medium h-15 px-1">
                                        Address: <span className="font-normal">{item?.address}</span>
                                    </div>
                                    <div className="border font-medium h-10 rounded-b-sm px-1 flex justify-around text-3xl">
                                        <button className='text-red-500 cursor-pointer' onClick={() => handleDelete(item._id)}><MdDeleteForever /></button>
                                        <button className='text-green-500 cursor-pointer' onClick={() => navigate(`/edit/${item._id}`)}><BiSolidEdit /></button>
                                    </div>
                                </div>
                            );
                        })
                        :
                        <p className='text-2xl sm:text-3xl text-center w-full my-2'>Data not found</p>
                }
            </div>
        </div>
    );
};
export default AllData;