import { useEffect, useRef, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from 'react-router';
const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    let url = import.meta.env.VITE_URL;

    const [error, setError] = useState(false);

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const inputRef = useRef([]);

    let navigate = useNavigate();

    const [start, setStart] = useState(false);
    const [time, setTime] = useState(600);

    const [sendEmail, setSendEmail] = useState(false);
    const [fillOtp, setFillOtp] = useState(false);

    const handleSendOTP = async (event) => {
        event.preventDefault();
        if (!email) {
            setError(true);
            return;
        }
        else if (email.trim()) {
            if (event.type === "click") {
                setStart(true);
                setTime(600);
            }
            try {
                let result = await fetch(`${url}/auth/sendOtp`, {
                    method: "post",
                    body: JSON.stringify({ email }),
                    headers: { "Content-type": "application/json" }
                });
                let data = await result.json();
                console.log(data);
                if (data.success) {
                    alert(data.message);
                    setSendEmail(true);
                }
                else {
                    alert(data.message);
                }
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


    const handlePaste = (event, index) => {
        const pasteData = event.clipboardData.getData("text").slice(0, 6);
        let sliceData = pasteData.split("");
        let valData = sliceData.every((v) => !isNaN(v) && v !== "");
        console.log(valData);
        if (sliceData.length == 6 && valData) {
            setOtp(sliceData);
            inputRef.current[5].focus();
        }
    }

    const handleSubmitOTP = (event) => {
        event.preventDefault();
        // let otp1 = otp.join("");
        // console.log(otp1);
        setFillOtp(true);
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


    // for reste password

    const handleResetPassword = async (event) => {
        event.preventDefault();
        let resetPasswordOtp = otp.join("");
        //console.log("email: ", email, "newpass: ", newPassword, "resetpass: ", resetPasswordOtp);;
        if (!email || !newPassword || !resetPasswordOtp) {
            setError(true);
            return;
        }
        else if (newPassword.length < 5) {
            alert("Please enter greater than 4 character/digit in password...");
        }
        else if (email.trim() && newPassword.trim() && resetPasswordOtp.trim()) {
            try {
                let result = await fetch(`${url}/auth/resetPassword`, {
                    method: "post",
                    body: JSON.stringify({ email, newPassword, resetPasswordOtp }),
                    headers: { "Content-type": "application/json" }
                });
                let data = await result.json();
                console.log(data);
                if (data.success) {
                    alert(data.message);
                    navigate("/login");
                }
                else {
                    alert(data.message);
                }
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

    useEffect(() => {
        if (sendEmail && !fillOtp) {
            inputRef.current[0].focus();
        }
    }, [sendEmail,fillOtp]);

    return (
        <div className="h-[calc(100vh-100px)] bg-gray-200 flex justify-center items-center">
            <div className="w-79 border rounded-xl p-4 sm:p-6 sm:w-100">

                {/* for email */}
                {!sendEmail && <><h1 className="text-center text-3xl text-gray-600">Reset Password</h1>
                    <h2 className="text-center sm:text-xl text-gray-600 mb-3">Enter Your registered email address</h2>
                    <form onSubmit={handleSendOTP}>
                        <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                            <MdOutlineMailOutline className="text-3xl text-gray-700" /><input type="email" placeholder="Enter Email ID..." className="focus:outline-0 w-[75%]" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {error && !email && <p className="ml-1 text-red-500">Please Enter Email...</p>}

                        <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                            <button className="h-full w-full rounded-2xl cursor-pointer">Send OTP</button>
                        </div>
                    </form>
                    <p className="mt-2 ml-1 text-xl mb-1 txt-red-500"> <Link to={"/login"} className="text-red-500 underline sm:text-xl font-medium">Back to Login</Link></p></>}

                {/* for otp */}
                {sendEmail && !fillOtp && <><h1 className="text-center text-3xl text-gray-600">Reset Password OTP</h1>
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
                        <span className="txt-red-500 border"><Link to={"/login"} className="text-red-500 underline sm:text-xl font-medium">Back to Login</Link></span>
                        <div className="border"> {start ? `Resend In: ${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}` : <button className="cursor-pointer" onClick={handleSendOTP}>Resent OTP</button>}</div>
                    </div></>}

                {/* for reset password */}
                {sendEmail && fillOtp && <>
                    <h1 className="text-center text-3xl text-gray-600">New Password</h1>
                    <h2 className="text-center sm:text-xl text-gray-600 mb-3">Enter the new password below</h2>
                    <form onSubmit={handleResetPassword}>
                        <div className="bg-gray-300 border text-xl flex justify-center items-center gap-2 sm:gap-4 rounded-2xl p-1 mt-3 sm:mt-5">
                            <TbLockPassword className="text-3xl text-gray-700" /><input type="password" placeholder="Enter Password..." className="focus:outline-0 w-[75%]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        {error && !newPassword && <p className="ml-1 text-red-500">Please Enter Password...</p>}

                        <div className="bg-gray-300 border text-xl flex justify-center items-center gap-4 rounded-2xl p-1 hover:bg-gray-400 mt-3 sm:mt-5">
                            <button className="h-full w-full rounded-2xl cursor-pointer">Reset Password</button>
                        </div>
                    </form>
                    <p className="mt-2 ml-1 text-xl mb-1 txt-red-500 sm:text-xl"><Link to={"/login"} className="text-red-500 underline font-medium">Back to Login</Link></p>
                </>}
            </div>
        </div>
    );
};
export default ForgotPassword;