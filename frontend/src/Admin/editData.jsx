import { useEffect, useState } from "react";
import { useParams } from "react-router";
import R from '../assets/R.jpeg';

const EditData = () => {

    const [title, setTitle] = useState("");
    const [area, setArea] = useState("");
    const [rent, setRent] = useState("");
    const [pincode, setPincode] = useState("");
    const [bhk, setBhk] = useState("");
    const [contact, setContact] = useState("");
    const [availability, setAvailability] = useState("");
    const [address, setAddress] = useState("");
    const [file, setFile] = useState();

    const [fileName, setFileName] = useState("");
    const [public_id, setPublic_id] = useState("");
    const [fileurl, setFileurl] = useState("");

    const [error, setError] = useState(false);

    let url = import.meta.env.VITE_URL;

    let id = useParams();
    let index = id.id;
    // console.log(index);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file) {
            const sizeInMB = file.size / (1024 * 1024);
            if (sizeInMB > 2) {
                alert("file size must be less than 2 MB");
                return;
            }
        }

        if (!title || !area || !rent || !pincode || !bhk || !contact || !availability || !address) {
            setError(true);
            return;
        }

        if (!title.trim() || !String(area).trim() || !String(rent).trim() || !String(pincode).trim() || !String(contact).trim() || !address.trim()) {
            alert("white space is not allowed...");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("area", area);
        formData.append("rent", rent);
        formData.append("pincode", pincode);
        formData.append("bhk", bhk);
        formData.append("contact", contact);
        formData.append("availability", availability);
        formData.append("address", address);
        if(file){
            formData.append("file", file);
        }
        formData.append("fileName", fileName);
        formData.append("public_id", public_id);
        formData.append("fileurl", fileurl);
        

        console.log([...formData]);
        try {
            let result = await fetch(`${url}/data/updateData/${index}`, {
                method: "put",
                body: formData,
                headers: {
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            });

            let data = await result.json();
            console.log(data);
        }
        catch (err) {
            alert("something went wrong...", err.message);
        }
    }


    const getSingleData = async () => {
        try {
            let result = await fetch(`${url}/data/getSingleData/${index}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            });
            let data = await result.json();
            if (data.success) {
                let d1 = data?.result;
                setTitle(d1?.title);
                setArea(d1?.area);
                setRent(d1?.rent);
                setPincode(d1?.pincode);
                setBhk(d1?.bhk);
                setContact(d1?.contact);
                setAvailability(d1?.availability);
                setAddress(d1?.address);
                setFileName(d1?.fileName);
                setPublic_id(d1?.public_id);
                setFileurl(d1?.url);
            }
            else {
                alert(data.message);
            }
        }
        catch (err) {
            console.log(err.message);
            alert("something went wrong...", err.message);
        }
    }

    useEffect(() => {
        getSingleData();
    }, []);

    // console.log(title);
    // console.log(area);
    // console.log(rent);
    // console.log(pincode);
    // console.log(bhk);
    // console.log(contact);
    // console.log(availability);
    // console.log(address);
    // console.log(fileName);
    // console.log(public_id);
    // console.log(fileurl);

    return (
        <div>
            <h1 className="text-center text-2xl sm:text-3xl mt-4 underline">Edit Property Details</h1>
            <div className="w-79 sm:w-120 lg:w-240 m-auto mt-5 px-4 pt-3 lg:pt-5 pb-8 mb-2 rounded-xl" style={{ boxShadow: '0px 0px 10px 1px rgba(197, 195, 195)' }}>
                <form onSubmit={handleSubmit}>
                    <div className=" grid lg:grid-cols-2 gap-x-10 gap-y-3 lg:gap-y-4 grid-cols-1">
                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Property Title:</label><br />
                            <input type="text" className="border w-full h-10 text-xl px-3 rounded-xl bg-gray-50" placeholder="Enter Property Title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                            {error && !title && <p className="ml-1 text-red-500">Please Enter Property Title...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Area (sq ft):</label><br />
                            <input type="number" className="border w-full h-10 text-xl px-3 rounded-xl bg-gray-50" placeholder="Enter Area in (sq ft)..." value={area} onChange={(e) => setArea(e.target.value)} />
                            {error && !area && <p className="ml-1 text-red-500">Please Enter Area...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Rent (₹):</label><br />
                            <input type="number" className="border w-full h-10 text-xl px-3 rounded-xl bg-gray-50" placeholder="Enter Rent in Rupees..." value={rent} onChange={(e) => setRent(e.target.value)} />
                            {error && !rent && <p className="ml-1 text-red-500">Please Enter Rent...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Pincode:</label><br />
                            <input type="number" className="border w-full h-10 text-xl px-3 rounded-xl bg-gray-50" placeholder="Enter Pincode..." value={pincode} onChange={(e) => setPincode(e.target.value)} />
                            {error && !pincode && <p className="ml-1 text-red-500">Please Enter Pincode...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">BHK:</label><br />
                            <select name="" id="" className="border w-full h-10 text-xl px-2 rounded-xl bg-gray-50" value={bhk} onChange={(e) => setBhk(e.target.value)}  >
                                <option value="">Select BHK...</option>
                                <option value="1BHK">1BHK</option>
                                <option value="2BHK">2BHK</option>
                                <option value="3BHK">3BHK</option>
                                <option value="4BHK">4BHK</option>
                                <option value="5BHK">5BHK</option>
                            </select>
                            {error && !bhk && <p className="ml-1 text-red-500">Please Select BHK...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Contact No:</label><br />
                            <input type="number" className="border w-full h-10 text-xl px-3 rounded-xl bg-gray-50" placeholder="Enter Contact No..." value={contact} onChange={(e) => setContact(e.target.value)} />
                            {error && !contact && <p className="ml-1 text-red-500">Please Enter Contact No...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Availability:</label><br />
                            <select name="" id="" className="border w-full h-10 text-xl px-2 rounded-xl bg-gray-50" value={availability} onChange={(e) => setAvailability(e.target.value)}  >
                                <option value="">Select Availability...</option>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                            {error && !availability && <p className="ml-1 text-red-500">Please Select Availability...</p>}
                        </div>

                        <div className="">
                            <label htmlFor="" className="text-xl ml-1 font-medium">Address:</label><br />
                            <textarea name="" id="" placeholder="Enter full address here..." className="border w-full rounded-xl px-2 text-xl resize-none bg-gray-50" value={address} onChange={(e) => setAddress(e.target.value)}  ></textarea>
                            {error && !address && <p className="ml-1 text-red-500">Please Enter Full Address...</p>}
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <label htmlFor="" className="text-xl ml-1 font-medium">Upload Image:</label><br />
                                <input
                                    type="file"
                                    className="block w-70 text-xl border border-gray-300 rounded-xl cursor-pointer   file:bg-gray-300 hover:file:bg-gray-400 transition-all file:py-1 file:px-2 bg-gray-50"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                {/* {error && !file && <p className="ml-1 text-red-500">Please Upload file (file size must be less than 2 MB.)...</p>} */}
                            </div>
                            <div>
                                {fileurl && <img src={fileurl} alt="broken" className="h-20 w-20 border rounded" />}

                                <input type="hidden" value={fileName} />
                                <input type="hidden" value={public_id} />
                                <input type="hidden" value={fileurl} />

                            </div>
                        </div>

                    </div>

                    <div className="border h-10 w-full lg:w-100 rounded-xl bg-green-300 hover:bg-green-400 flex justify-center items-center text-xl font-medium m-auto mt-8">
                        <button type="submit" className="h-full w-full cursor-pointer">Submit</button>
                    </div>
                </form>

            </div>
        </div>
    );
};
export default EditData;