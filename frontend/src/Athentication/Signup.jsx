import { useEffect, useRef, useState } from "react";
import { MdPermIdentity } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from 'react-router';

const Signup = () => {

    const [inputValue, setInputValue] = useState({
        name: "",
        email: "",
        password: ""
    });

    let navigate = useNavigate();

    const [error, setError] = useState(false);

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const inputRef = useRef([]);

    const [start, setStart] = useState(false);
    const [time, setTime] = useState(600);

    const [getOtp, setGetOtp] = useState(true);

    let url = import.meta.env.VITE_URL;

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.name || !inputValue.email || !inputValue.password) {
            setError(false);
            return;
        }
        else if (inputValue.name.length < 2) {
            alert("Please enter greater than 2 character in name...");
        }
        else if (inputValue.password.length < 5) {
            alert("Please enter greater than 4 character/digit in password...");
        }
        else if (inputValue.name.trim() && inputValue.email.trim() && inputValue.password.trim()) {
            if (event.type === "click") {
                setStart(true);
                setTime(600);
            }
            try {
                let result = await fetch(`${url}/auth/signup`, {
                    method: "post",
                    body: JSON.stringify(inputValue),
                    headers: { "Content-type": "application/json" }
                });
                let data = await result.json();
                console.log(data);
                if (data.success) {
                    //console.log(data.user);
                    alert(data.message);
                    setGetOtp(false);
                }
                else {
                    alert(data.message);
                }
            }
            catch (err) {
                alert("something went wrong...", err.message);
            }
        }
        else {
            alert("white space is not allowed...");
        }
    }

    // for Submit OTP 

    const handleChangeOTP = (value, index) => {
        if (isNaN(value)) return;
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (event, index) => {
        if (event.key == "Backspace" && index > 0 && event.target.value == "") {
            inputRef.current[index - 1].focus();
        }
    }

    // for time

    useEffect(() => {
        if (!start) return;
        let interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    setStart(false);
                    return 0;
                }
                else {
                    return (prev - 1);
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [start]);

    let minute = Math.floor(time / 60);
    let second = time % 60;

    const handlePaste = (event, index) => {
        const pasteData = event.clipboardData.getData("text").slice(0, 6);
        let sliceData = pasteData.split("");
        let valData = sliceData.every((v) => !isNaN(v) && v !== "");
        //console.log(valData);
        if (sliceData.length == 6 && valData) {
            setOtp(sliceData);
            inputRef.current[5].focus();
        }
    }

    const handleSubmitOTP = async (event) => {
        event.preventDefault();
        let verifyEmailOtp = otp.join("");
        //console.log(verifyEmailOtp);
        let email = inputValue.email;
        if (!email || !verifyEmailOtp) {
            setError(false);
            return;
        }
        else if (inputValue.email.trim() && verifyEmailOtp.trim()) {
            try {
                let result = await fetch(`${url}/auth/verifyAccount`, {
                    method: "post",
                    body: JSON.stringify({ email, verifyEmailOtp }),
                    headers: { "Content-type": "application/json" }
                });
                let data = await result.json();
                //console.log(data);
                if (data.success) {
                    // console.log(data.auth);
                    // console.log(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("token", JSON.stringify(data.auth));
                    alert(data.message);
                    navigate("/");
                }
                else {
                    alert(data.message);
                }
            }
            catch (err) {
                alert("something went wrong...", err.message);
            }

        }
        else {
            alert("white space is not allowed...");
        }
    }

    useEffect(() => {
        if (!getOtp) {
            inputRef.current[0].focus();
        }
    }, [getOtp]);

    return (
        <div className="h-[calc(100vh-100px)] bg-gray-200 flex justify-center items-center">
            <div className="w-79 border rounded-xl p-4 sm:p-6 sm:w-100">

                {getOtp ?
                    <>
                        <h1 className="text-center text-3xl text-gray-600">Create Account</h1>
                        <h2 className="text-center text-xl text-gray-600 mb-3 sm:text-2xl">create your account</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1">
                                <MdPermIdentity className="text-3xl text-gray-700" /><input type="text" placeholder="Enter Name..." className="focus:outline-0 w-[75%]" name="name" value={inputValue.name} onChange={handleChange} />
                            </div>
                            {error && !inputValue.name && <p className="ml-1 text-red-500">Please Enter Name...</p>}

                            <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                                <MdOutlineMailOutline className="text-3xl text-gray-700" /><input type="email" placeholder="Enter Email ID..." className="focus:outline-0 w-[75%]" name="email" value={inputValue.email} onChange={handleChange} />
                            </div>
                            {error && !inputValue.email && <p className="ml-1 text-red-500">Please Enter Email...</p>}

                            <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                                <TbLockPassword className="text-3xl text-gray-700" /><input type="password" placeholder="Enter Password..." className="focus:outline-0 w-[75%]" name="password" value={inputValue.password} onChange={handleChange} />
                            </div>
                            {error && !inputValue.password && <p className="ml-1 text-red-500">Please Enter Password...</p>}

                            <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                                <button className="h-full w-full rounded-2xl cursor-pointer">Signup</button>
                            </div>
                        </form>
                        <p className="text-center mt-2 mb-1 sm:text-xl">Already have an account? <Link to={"/login"} className="text-red-500 underline font-medium">Login here</Link></p>
                    </>
                    :
                    <>
                        <h1 className="text-center text-3xl text-gray-600">Verify Email OTP</h1>
                        <h2 className="text-center text-gray-600 mb-3 text-[15px]">Enter the 6-digit code sent to your email</h2>
                        <form onSubmit={handleSubmitOTP}>

                            <div className="flex justify-between">
                                {otp?.map((v, index) => {
                                    return (
                                        <input
                                            key={index}
                                            className="border h-10 w-10 text-2xl sm:h-12 sm:w-12 sm:text-3xl rounded text-center"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={'1'}
                                            value={otp[index]}
                                            onChange={(e) => handleChangeOTP(e.target.value, index)}
                                            ref={(input) => inputRef.current[index] = input}
                                            onKeyDown={(event) => handleKeyDown(event, index)}
                                            onPaste={(event) => handlePaste(event, index)}
                                        />
                                    )
                                })}
                            </div>
                            <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                                <button className="h-full w-full rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={!otp.every((v) => v !== "")}>Submit OTP</button>
                            </div>
                        </form>
                        <div className="border mt-3 mb-1 flex justify-between items-center sm:text-xl px-1">
                            <span className="txt-red-500 border"><Link to={"/login"} className="text-red-500 underline font-medium">Back to login</Link></span>
                            <div className="border"> {start ? `Resend In: ${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}` : <button className="cursor-pointer text-red-500 underline font-medium" onClick={handleSubmit}>Resent OTP</button>}</div>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};
export default Signup;